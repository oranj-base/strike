'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';

const uiParamSchema = Joi.object({
  name: Joi.string().required(),
  label: Joi.string().required(),
  candidType: Joi.string().required(),
});

const actionSchema = Joi.object({
  label: Joi.string().required(),
  method: Joi.string().required(),
  type: Joi.string().required(),
  uiParams: Joi.array().items(uiParamSchema),
  outputs: Joi.array().items(Joi.string().required()),
});

const formSchema = Joi.object({
  icon: Joi.string().required(),
  homepage: Joi.string().required(),
  label: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  canisterId: Joi.string().required(),
  hasSwibCanisterId: Joi.boolean(),
  swibCanisterId: Joi.string().allow(''),
  actions: Joi.array().items(actionSchema),
});

type FormValues = {
  icon: string;
  homepage: string;
  label: string;
  title: string;
  description: string;
  canisterId: string;
  hasSwibCanisterId: boolean;
  swibCanisterId: string;
  actions: {
    label: string;
    method: string;
    type: string;
    uiParams: { name: string; label: string; candidType: string }[];
    outputs: string[];
  }[];
};

export default function CreateStrikeCardPage() {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: joiResolver(formSchema),
    defaultValues: {
      icon: '',
      homepage: '',
      label: '',
      title: '',
      description: '',
      canisterId: '',
      hasSwibCanisterId: false,
      swibCanisterId: '',
      actions: [],
    },
  });

  const {
    fields: actionFields,
    append: appendAction,
    remove: removeAction,
  } = useFieldArray({
    control,
    name: 'actions',
  });

  // For action draft
  const [actionDraft, setActionDraft] = useState({
    label: '',
    method: '',
    type: '',
    uiParams: [] as { name: string; label: string; candidType: string }[],
    outputs: [] as string[],
  });
  const [uiParamDraft, setUiParamDraft] = useState({
    name: '',
    label: '',
    candidType: '',
  });
  const [outputDraft, setOutputDraft] = useState('');

  const hasSwibCanisterId = watch('hasSwibCanisterId');

  const onSubmit = (data: FormValues) => {
    // TODO: handle create logic
    // console.log(data);
  };

  // UI Param handlers for action draft
  const handleAddUiParam = () => {
    if (!uiParamDraft.name || !uiParamDraft.label || !uiParamDraft.candidType)
      return;
    setActionDraft((prev) => ({
      ...prev,
      uiParams: [...prev.uiParams, { ...uiParamDraft }],
    }));
    setUiParamDraft({ name: '', label: '', candidType: '' });
  };

  const handleRemoveUiParam = (idx: number) => {
    setActionDraft((prev) => ({
      ...prev,
      uiParams: prev.uiParams.filter((_, i) => i !== idx),
    }));
  };

  // Output handlers for action draft
  const handleAddOutput = () => {
    if (!outputDraft) return;
    setActionDraft((prev) => ({
      ...prev,
      outputs: [...prev.outputs, outputDraft],
    }));
    setOutputDraft('');
  };

  const handleRemoveOutput = (idx: number) => {
    setActionDraft((prev) => ({
      ...prev,
      outputs: prev.outputs.filter((_, i) => i !== idx),
    }));
  };

  // Add action to actions array
  const handleAddAction = () => {
    if (!actionDraft.label || !actionDraft.method || !actionDraft.type) return;
    appendAction({ ...actionDraft });
    setActionDraft({
      label: '',
      method: '',
      type: '',
      uiParams: [],
      outputs: [],
    });
    setUiParamDraft({ name: '', label: '', candidType: '' });
    setOutputDraft('');
  };

  return (
    <div className="container max-w-xl mx-auto py-10">
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-indigo-700">
            Create Strike Card
          </CardTitle>
          <CardDescription className="text-lg text-gray-500">
            Easily create a new Strike Card by filling in the details below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Icon */}
            <div>
              <Label htmlFor="icon" className="text-indigo-600 font-semibold">
                Icon
              </Label>
              <Input
                id="icon"
                {...register('icon')}
                placeholder="Enter icon"
                className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              {errors.icon && (
                <span className="text-red-500 text-xs">
                  {errors.icon.message}
                </span>
              )}
            </div>
            {/* HomePage */}
            <div>
              <Label
                htmlFor="homepage"
                className="text-indigo-600 font-semibold"
              >
                HomePage
              </Label>
              <Input
                id="homepage"
                {...register('homepage')}
                placeholder="Enter homepage"
                className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              {errors.homepage && (
                <span className="text-red-500 text-xs">
                  {errors.homepage.message}
                </span>
              )}
            </div>
            {/* Label */}
            <div>
              <Label htmlFor="label" className="text-indigo-600 font-semibold">
                Label
              </Label>
              <Input
                id="label"
                {...register('label')}
                placeholder="Enter label"
                className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              {errors.label && (
                <span className="text-red-500 text-xs">
                  {errors.label.message}
                </span>
              )}
            </div>
            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-indigo-600 font-semibold">
                Title
              </Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter title"
                className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              {errors.title && (
                <span className="text-red-500 text-xs">
                  {errors.title.message}
                </span>
              )}
            </div>
            {/* Description */}
            <div>
              <Label
                htmlFor="description"
                className="text-indigo-600 font-semibold"
              >
                Description
              </Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="Enter description"
                className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              {errors.description && (
                <span className="text-red-500 text-xs">
                  {errors.description.message}
                </span>
              )}
            </div>
            {/* CanisterID */}
            <div>
              <Label
                htmlFor="canister-id"
                className="text-indigo-600 font-semibold"
              >
                CanisterID
              </Label>
              <Input
                id="canister-id"
                {...register('canisterId')}
                placeholder="Enter canister ID"
                className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
              />
              {errors.canisterId && (
                <span className="text-red-500 text-xs">
                  {errors.canisterId.message}
                </span>
              )}
            </div>
            {/* SwibCanister ID */}
            <div className="flex items-center space-x-2">
              <Controller
                control={control}
                name="hasSwibCanisterId"
                render={({ field }) => (
                  <Checkbox
                    id="swib-canister-id"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-1 accent-indigo-600"
                  />
                )}
              />
              <Label
                htmlFor="swib-canister-id"
                className="text-indigo-600 font-semibold"
              >
                SWIB Canister ID
              </Label>
            </div>
            {hasSwibCanisterId && (
              <div>
                <Label
                  htmlFor="swib-canister-id-input"
                  className="text-indigo-600 font-semibold"
                >
                  SWIB Canister ID
                </Label>
                <Input
                  id="swib-canister-id-input"
                  {...register('swibCanisterId')}
                  placeholder="Enter SWIB canister ID"
                  className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                />
                {errors.swibCanisterId && (
                  <span className="text-red-500 text-xs">
                    {errors.swibCanisterId.message}
                  </span>
                )}
              </div>
            )}
            {/* Actions */}
            <div className="bg-gradient-to-r from-indigo-100 via-white to-indigo-200 rounded-xl p-6 space-y-6 shadow-lg">
              <p className="font-semibold text-indigo-700 text-lg">Actions</p>
              {/* List of added actions */}
              {actionFields.length > 0 && (
                <div className="space-y-2 mb-4">
                  {actionFields.map((action, idx) => (
                    <div
                      key={action.id}
                      className="border rounded-lg p-3 bg-white shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-semibold text-indigo-700">
                          {action.label}
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => removeAction(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="mr-2">
                          Method:{' '}
                          <span className="font-medium text-indigo-600">
                            {action.method}
                          </span>
                        </span>
                        <span className="mr-2">
                          Type:{' '}
                          <span className="font-medium text-indigo-600">
                            {action.type}
                          </span>
                        </span>
                        <div>
                          <span className="font-semibold">UI Params:</span>{' '}
                          {action.uiParams.length === 0 ? (
                            <span className="text-gray-400">None</span>
                          ) : (
                            action.uiParams.map((p, i) => (
                              <span key={i}>
                                <span className="text-indigo-500">
                                  {p.name}
                                </span>{' '}
                                <span className="text-gray-400">
                                  ({p.label})
                                </span>{' '}
                                [{p.candidType}]
                                {i < action.uiParams.length - 1 ? ', ' : ''}
                              </span>
                            ))
                          )}
                        </div>
                        <div>
                          <span className="font-semibold">Outputs:</span>{' '}
                          {action.outputs.length === 0 ? (
                            <span className="text-gray-400">None</span>
                          ) : (
                            action.outputs.join(', ')
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Action Label Input */}
              <div>
                <Label
                  htmlFor="action-label"
                  className="text-indigo-600 font-semibold"
                >
                  Action Label
                </Label>
                <Input
                  id="action-label"
                  value={actionDraft.label}
                  onChange={(e) =>
                    setActionDraft((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                  placeholder="Enter action label"
                  className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {/* Method Input */}
              <div>
                <Label
                  htmlFor="action-method"
                  className="text-indigo-600 font-semibold"
                >
                  Method
                </Label>
                <Input
                  id="action-method"
                  value={actionDraft.method}
                  onChange={(e) =>
                    setActionDraft((prev) => ({
                      ...prev,
                      method: e.target.value,
                    }))
                  }
                  placeholder="Enter method"
                  className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {/* Type Selector */}
              <div>
                <Label
                  htmlFor="action-type"
                  className="text-indigo-600 font-semibold"
                >
                  Type
                </Label>
                <Select
                  value={actionDraft.type}
                  onValueChange={(val) =>
                    setActionDraft((prev) => ({ ...prev, type: val }))
                  }
                >
                  <SelectTrigger
                    id="action-type"
                    className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="query">Query</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Action UI Parameters */}
              <div className="bg-indigo-50 rounded-lg p-3 space-y-2">
                <p className="font-semibold text-indigo-700">
                  Action UI Parameters
                </p>
                {actionDraft.uiParams.length > 0 && (
                  <ul className="mb-2">
                    {actionDraft.uiParams.map((param, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="text-gray-700">
                          {param.name}{' '}
                          <span className="text-gray-400">({param.label})</span>{' '}
                          <span className="text-indigo-500">
                            [{param.candidType}]
                          </span>
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveUiParam(idx)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-col md:items-center md:flex-row md:space-x-2 space-y-2 md:space-y-0">
                  <Input
                    id="action-ui-param-name"
                    value={uiParamDraft.name}
                    onChange={(e) =>
                      setUiParamDraft((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Name"
                    className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                  />
                  <Input
                    id="action-ui-param-label"
                    value={uiParamDraft.label}
                    onChange={(e) =>
                      setUiParamDraft((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="Label"
                    className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                  />
                  <Select
                    value={uiParamDraft.candidType}
                    onValueChange={(val) =>
                      setUiParamDraft((prev) => ({
                        ...prev,
                        candidType: val,
                      }))
                    }
                  >
                    <SelectTrigger
                      id="action-ui-param-candidtype"
                      className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                    >
                      <SelectValue placeholder="CandidType" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    onClick={handleAddUiParam}
                  >
                    Add
                  </Button>
                </div>
              </div>
              {/* Action Outputs */}
              <div className="bg-indigo-50 rounded-lg p-3 space-y-2">
                <p className="font-semibold text-indigo-700">Action Outputs</p>
                {actionDraft.outputs.length > 0 && (
                  <ul className="mb-2">
                    {actionDraft.outputs.map((output, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <span className="text-gray-700">{output}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleRemoveOutput(idx)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-row space-x-2">
                  <Select value={outputDraft} onValueChange={setOutputDraft}>
                    <SelectTrigger
                      id="action-output-type"
                      className="mt-1 rounded-lg border-indigo-200 focus:ring-2 focus:ring-indigo-400"
                    >
                      <SelectValue placeholder="Select output type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="principal">Principal</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                    onClick={handleAddOutput}
                  >
                    Add
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-indigo-800"
                onClick={handleAddAction}
              >
                Add Action
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full mt-8 py-3 text-lg bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-bold rounded-xl shadow-xl hover:from-indigo-700 hover:to-indigo-900 transition"
            >
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
