'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { type TestDefinition, type TestResult, TESTS } from './tests.ts';

const API_BASE_URL =
  import.meta.env.VITE_CORS_API_URL || 'http://localhost:8787';

export default function CORSPlayground() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expandedTest, setExpandedTest] = useState<string | undefined>(
    TESTS[0].id
  );

  const onSendRequest = async (test: TestDefinition) => {
    setLoading(prev => ({ ...prev, [test.id]: true }));

    try {
      const { request } = test;
      const endpoint = new URL(request.endpoint, API_BASE_URL).toString();

      const response = await fetch(endpoint, {
        method: request.method,
        headers: request.headers,
        credentials: request.credentials,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });

      let body;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }

      setResults(prev => ({
        ...prev,
        [test.id]: {
          id: test.id,
          response: {
            success: response.ok,
            status: response.status,
            body,
          },
        },
      }));
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResults(prev => ({
          ...prev,
          [test.id]: {
            id: test.id,
            response: {
              success: false,
            },
            error: error.message,
          },
        }));
      }
    }

    setLoading(prev => ({ ...prev, [test.id]: false }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-gray-50">
            CORS Playground
          </h1>
          <p className="text-gray-400">
            Test and understand CORS behavior with Express.js
          </p>
        </div>
        <div className="space-y-2">
          {TESTS.map(test => {
            const { request } = test;
            const isExpanded = expandedTest === test.id;
            const result = results[test.id];

            return (
              <div
                key={test.id}
                className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800"
              >
                <button
                  onClick={() =>
                    setExpandedTest(isExpanded ? undefined : test.id)
                  }
                  className="hover:bg-gray-750 flex w-full cursor-pointer items-center justify-between px-5 py-4 transition-colors"
                >
                  <div className="flex flex-1 items-center gap-4 text-left">
                    <span className="rounded bg-gray-700 px-2 py-1 font-mono text-xs font-semibold text-gray-50">
                      {request.method}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-50">{test.name}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
                {isExpanded && (
                  <div className="bg-gray-750 space-y-6 border-t border-gray-700 px-5 py-4">
                    <p className="text-sm text-gray-400">{test.description}</p>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-50">
                        Request
                      </h4>
                      <div className="space-y-2 rounded border border-gray-700 bg-gray-900 p-3 font-mono text-xs">
                        <div>
                          <span className="text-gray-400">
                            {request.method}{' '}
                          </span>
                          <span className="text-gray-50">
                            {request.endpoint}
                          </span>
                        </div>

                        {request.credentials && (
                          <div>
                            <span className="text-gray-400">credentials: </span>
                            <span className="text-gray-50">
                              {request.credentials}
                            </span>
                          </div>
                        )}

                        {request.headers && (
                          <div className="pt-1">
                            <div className="mb-1 text-gray-400">Headers:</div>
                            {Object.entries(request.headers).map(
                              ([key, value]) => (
                                <div key={key} className="ml-2 text-gray-50">
                                  {key}: {value}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => onSendRequest(test)}
                      disabled={loading[test.id]}
                      className="cursor-pointer rounded bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100 disabled:opacity-50"
                    >
                      {loading[test.id] ? 'Running...' : 'Send Request'}
                    </button>
                    {result && (
                      <div className="space-y-4 border-t border-gray-700 pt-4">
                        <div
                          className={`rounded border p-3 ${
                            result.response.success
                              ? 'border-green-700 bg-green-900/30 text-green-400'
                              : 'border-red-700 bg-red-900/30 text-red-400'
                          }`}
                        >
                          <p className="mb-2 text-sm font-semibold">
                            {result.response.success ? 'Success' : 'Failed'}
                          </p>
                          <p className="text-sm leading-relaxed">
                            {test.explanation}
                          </p>
                        </div>

                        {result.error == null && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-50">
                              Response
                            </h4>
                            <div className="space-y-2 rounded border border-gray-700 bg-gray-900 p-3 font-mono text-xs">
                              <div>
                                <span className="text-gray-400">Status: </span>
                                <span
                                  className={
                                    result.response.success
                                      ? 'text-green-400'
                                      : 'text-red-400'
                                  }
                                >
                                  {result.response.status}
                                </span>
                              </div>
                              <div className="pt-1">
                                <div className="mb-1 text-gray-400">Body:</div>
                                <div className="ml-2 text-gray-50">
                                  {typeof result.response.body === 'string'
                                    ? result.response.body
                                    : JSON.stringify(
                                        result.response.body,
                                        null,
                                        2
                                      )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
