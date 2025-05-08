chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (
    !sender.tab &&
    msg.type !== 'getNetwork' &&
    msg.type !== 'getAccounts' &&
    msg.type !== 'requestAccounts' &&
    msg.type !== 'getBalance' &&
    msg.type !== 'signMessage' &&
    msg.type !== 'sendBitcoin' &&
    msg.type !== 'getPublicKey' &&
    msg.type !== 'getAddressType' &&
    msg.type !== 'getAppVersion' &&
    msg.type !== 'getSupportedMethods' &&
    msg.type !== 'pushTx' &&
    msg.type !== 'pushPsbt' &&
    msg.type !== 'fetchAndValidateFile' &&
    msg.type !== 'requestConnect'
  ) {
    return null;
  }

  // Handle wallet-related requests
  handleWalletCommunication(sender.tab?.id, msg.type, msg.wallet, msg.payload)
    .then((res) => {
      sendResponse(res);
    })
    .catch((err) => {
      console.error('error handling message', err);
      sendResponse({ error: err.message || 'Unknown error' });
    });

  return true; // Indicates we'll respond asynchronously
});

async function handleWalletCommunication(
  tabId: number | undefined,
  type: string,
  wallet: string,
  payload: any,
) {
  // If this is a request coming from the extension itself (no tab)
  if (!tabId) {
    switch (type) {
      case 'getAccounts':
      case 'requestAccounts': {
        // Handle direct connection to get wallet accounts
        try {
          const provider = getProviderFromWindow(wallet);
          if (!provider) {
            return { error: `Provider ${wallet} not found` };
          }
          let accounts;
          if (provider.request) {
            accounts = await provider.request(
              'getAccounts',

              payload.purposes ? { purposes: payload.purposes } : {},
            );
          } else if (provider.getAccounts) {
            accounts = await provider.getAccounts(payload.purposes);
          } else if (provider.connect) {
            accounts = await provider.connect();
          } else {
            throw new Error('Provider does not support getAccounts');
          }
          return accounts;
        } catch (error: any) {
          return { error: error.message || 'Failed to get accounts' };
        }
      }
      case 'getNetwork': {
        try {
          const provider = getProviderFromWindow(wallet);
          if (!provider) {
            return { error: `Provider ${wallet} not found` };
          }

          const network = await provider.request('getNetwork');
          return network;
        } catch (error: any) {
          return { error: error.message || 'Failed to get balance' };
        }
      }
      // Handle other wallet methods similarly...
      default:
        return { error: `Unsupported operation: ${type}` };
    }
  }

  // Handle tab-based operations
  if (type === 'connect') {
    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId },
      func: async (walletKey) => {
        // Split by . to handle nested providers
        if (!walletKey) {
          throw new Error('walletKey is null or undefined');
        }
        if (!walletKey) {
          throw new Error('walletKey is null or undefined');
        }
        const keys = walletKey.split('.');
        let provider = window as any;

        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }

        if (!provider) {
          throw new Error(`Provider not found`);
        }

        // Connect to the wallet
        if (provider.connect) {
          await provider.connect();
        } else if (provider.request) {
          await provider.request('connect');
        }

        // Get public key
        if (provider.publicKey) {
          return provider.publicKey.toString();
        } else if (provider.request) {
          const accounts = await provider.request('getAccounts');
          return accounts.length > 0 ? accounts[0].publicKey : null;
        }

        return null;
      },
      args: [wallet],
    });

    return res[0].result;
  } else if (type === 'getAccounts' || type === 'requestAccounts') {
    // Convert purposes to a JSON string to ensure it's serializable
    const purposesJson =
      payload && payload.purposes ? JSON.stringify(payload.purposes) : null;

    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId },
      func: async (walletKey, purposesJsonStr) => {
        if (!walletKey) {
          throw new Error('walletKey is null or undefined');
        }

        // Parse purposes from JSON string
        const purposes = purposesJsonStr ? JSON.parse(purposesJsonStr) : null;

        // Get provider
        const keys = walletKey.split('.');
        let provider = window as any;

        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }

        if (!provider) {
          throw new Error(`Provider not found`);
        }
        // Request accounts
        let accounts;

        if (provider.requestAccounts) {
          accounts = await provider.requestAccounts();
        } else if (provider.getAccounts) {
          accounts = await provider.getAccounts(purposes);
        } else if (provider.request) {
          accounts = await provider.request(
            walletKey.includes('Xverse')
              ? 'getAccounts'
              : walletKey.includes('Orange')
                ? 'getAddresses'
                : 'requestAccounts',
            { purposes: purposes },
          );
        } else if (provider.connect) {
          accounts = await provider.connect();
        }

        return accounts;
      },
      args: [wallet, purposesJson],
    });

    if (res[0].result && res[0].result.error) {
      return { error: res[0].result.error };
    }

    if (res[0].result.result.addresses) {
      res[0].result.result = res[0].result.result.addresses.map(
        (address: any) => {
          return {
            address: address.address,
            publicKey: address.publicKey,
            purpose: address.purpose,
          };
        },
      );
    }

    return res[0].result;
  } else if (type === 'signMessage') {
    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId },
      func: async (walletKey, address, message) => {
        // Get provider
        const keys = walletKey.split('.');
        let provider = window as any;

        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }

        if (!provider) {
          throw new Error(`Provider not found`);
        }

        // Sign message
        if (
          provider.signMessage &&
          !walletKey.includes('Xverse') &&
          !walletKey.includes('Orange')
        ) {
          return await provider.signMessage(message);
        } else if (provider.request) {
          const result = await provider.request('signMessage', {
            address,
            message,
          });
          return result;
        }

        throw new Error('Provider does not support signing');
      },
      args: [wallet, payload.address ?? '', payload.message],
    });

    return res[0].result;
  } else if (type === 'sendBitcoin') {
    // Convert recipients to a JSON string to ensure it's serializable
    const recipientsJson =
      payload && payload.recipients ? JSON.stringify(payload.recipients) : null;

    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId },
      func: async (walletKey, recipientsJsonStr) => {
        // Parse recipients from JSON string
        const recipients = recipientsJsonStr
          ? JSON.parse(recipientsJsonStr)
          : null;
        if (!recipients) {
          throw new Error('Invalid recipients');
        }

        // Get provider
        if (!walletKey) {
          throw new Error('walletKey is null or undefined');
        }
        const keys = walletKey.split('.');
        let provider = window as any;

        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }

        if (!provider) {
          throw new Error(`Provider not found`);
        }

        // Send bitcoin
        if (provider.request) {
          const result = await provider.request('sendTransfer', {
            recipients,
          });
          return result?.txid || result;
        } else if (provider.sendBitcoin) {
          const recipient = recipients[0];
          return await provider.sendBitcoin(
            recipient.address,
            recipient.amount,
          );
        }

        throw new Error('Provider does not support sending bitcoin');
      },
      args: [wallet, recipientsJson],
    });

    return res[0].result;
  } else if (type === 'getNetwork') {
    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId },
      func: async (walletKey) => {
        // Get provider
        const keys = walletKey.split('.');
        let provider = window as any;

        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }

        if (!provider) {
          throw new Error(`Provider not found`);
        }

        // Get network
        if (provider.getNetwork) {
          return await provider.getNetwork();
        } else if (provider.request) {
          const result = await provider.request('getNetwork');
          return result;
        }

        throw new Error('Provider does not support getNetwork');
      },
      args: [wallet],
    });

    return res[0].result;
  } else if (type === 'getBalance') {
    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId },
      func: async (walletKey) => {
        // Get provider
        const keys = walletKey.split('.');
        let provider = window as any;

        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }

        if (!provider) {
          throw new Error(`Provider not found`);
        }

        // Get balance
        if (provider.request) {
          const result = await provider.request('getBalance');
          return {
            total: parseFloat(result.total),
            confirmed: parseFloat(result.confirmed),
            unconfirmed: parseFloat(result.unconfirmed),
          };
        } else if (provider.getBalance) {
          return await provider.getBalance();
        }

        throw new Error('Provider does not support getBalance');
      },
      args: [wallet],
    });

    return res[0].result;
  } else if (type === 'getPublicKey') {
    const result = await chrome.scripting.executeScript({
      target: { tabId }, // Target all tabs/windows
      world: 'MAIN',
      func: async (walletKey) => {
        // Get the provider
        const keys = walletKey.split('.');
        let provider = window as any;
        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }

        if (!provider) {
          return { error: `Provider not found` };
        }

        // Try different methods to get public key
        let publicKey;

        if (provider.getPublicKey) {
          // Direct method call if available
          publicKey = await provider.getPublicKey();
        } else if (provider.request) {
          // Try request method first with getPublicKey
          publicKey = await provider.request('getPublicKey');
        } else {
          throw new Error('Provider does not support getPublicKey');
        }

        return { result: publicKey };
      },
      args: [wallet],
    });

    // Check for errors or return the result
    if (result[0].result && result[0].result.error) {
      return { error: result[0].result.error };
    }
    return result[0].result?.result;
  } else if (type === 'requestConnect') {
    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId },
      func: async (walletKey, whitelist) => {
        // Get provider
        const keys = walletKey.split('.');
        let provider = window as any;
        for (const key of keys) {
          if (provider) {
            provider = provider[key];
          }
        }
        if (!provider) {
          throw new Error(`Provider not found`);
        }
        // Request connection
        const result = await provider.requestConnect(whitelist);
        return result;
      },
      args: [wallet, payload.whitelist],
    });
    if (res[0].result && res[0].result.error) {
      return { error: res[0].result.error };
    }
    return res[0].result;
  }

  // Implement other wallet operations as needed following the same pattern

  return { error: `Unsupported operation: ${type}` };
}

// Helper function to get provider from window for direct extension access
function getProviderFromWindow(providerKey: string): any {
  // This would be implemented to access providers from the background context
  // Note: Direct window access is limited in background scripts
  // This is a placeholder that would need proper implementation
  return null;
}

console.log('Background script running');

// Add any background functionality you might need here
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});
