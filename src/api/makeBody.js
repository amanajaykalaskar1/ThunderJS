/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 Metrological
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default (requestId, plugin, method, params, version) => {
  if (params) {
    // delete possible version key from params
    delete params.version
    // if you want to pass 'version' as a parameter, use versionAsParameter
    if (params.versionAsParameter) {
      params.version = params.versionAsParameter
      delete params.versionAsParameter
    }
  }

  const body = {
    jsonrpc: '2.0',
    id: requestId,
    method: [plugin, version, method].join('.'),
  }

  // check if params exist
  params !== undefined ? (body.params = params) : null

  return body
}
