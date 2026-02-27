# VCF Automation Reference

Generated Documentation

## VCFACatalogResourceService

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `allSupervisorResources_internal` |  | `Array/Object` | Yes |

### Methods

#### `VCFACatalogResourceService`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `host` | `VCFAHost` |  |

**Returns:** `void`

---

#### `getSupervisorResource_internal`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `String` |  |

**Returns:** `VCFASupervisorResource`

---

#### `getSupervisorResource`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `String` |  |

**Returns:** `VCFASupervisorResource`

---

#### `getSupervisorNamespaceResources_internal`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `namespaceName` | `String` |  |

**Returns:** `Array/VCFASupervisorResource`

---

## VCFACciService

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `allSupervisorNamespaces_internal` |  | `Array/Object` | Yes |
| `allSupervisorNamespaces` |  | `Array/Object` | Yes |

### Methods

#### `VCFACciService`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `host` | `VCFAHost` |  |

**Returns:** `void`

---

#### `getSupervisorNamespacesForProject`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `projectName` | `String` |  |

**Returns:** `Array/VCFASupervisorNamespace`

---

#### `createSupervisorNamespace`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `projectName` | `String` |  |
| `jsonSpec` | `String` |  |

**Returns:** `VCFASupervisorNamespace`

---

#### `getSupervisorNamespace`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `projectName` | `String` |  |
| `name` | `String` |  |

**Returns:** `VCFASupervisorNamespace`

---

#### `getSupervisorNamespacesForProject_internal`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `projectName` | `String` |  |

**Returns:** `Array/VCFASupervisorNamespace`

---

#### `getSupervisorNamespace_internal`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `projectName` | `String` |  |
| `name` | `String` |  |

**Returns:** `VCFASupervisorNamespace`

---

## VCFAEntitiesFinder

**Description:** VMware Cloud Foundation Automation Entity finder to search for an entity

## VCFAGenericRestClient

**Description:** A generic VMware Cloud Foundation Automation Rest client for executing REST operations

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `host` |  | `VCFAHost` | No |

### Methods

#### `VCFAGenericRestClient`
Automation GenericRestClient No Argument Constructor.

**Returns:** `void`

---

#### `get`
Get Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload)

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `request` | `VCFARestRequest` |  |

**Returns:** `VCFARestResponse`

---

#### `execute`
Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload)

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `restRequest` | `VCFARestRequest` |  |

**Returns:** `VCFARestResponse`

---

#### `put`
Put Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload)

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `request` | `VCFARestRequest` |  |

**Returns:** `VCFARestResponse`

---

#### `delete`
Delete Method (Http Delete) to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload)

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `request` | `VCFARestRequest` |  |

**Returns:** `VCFARestResponse`

---

#### `post`
Post Method to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload)

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `request` | `VCFARestRequest` |  |

**Returns:** `VCFARestResponse`

---

#### `createRequest`
Method to create HTTP rest Request. It holds parameter (HTTP Method (GET/PUT/POST/DELETE/PATCH), Resource Path URI, Request Payload (Stringified JSON)).

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `method` | `String` |  |
| `path` | `String` |  |
| `requestPayload` | `String` |  |

**Returns:** `VCFARestRequest`

---

#### `patch`
Patch Method (Http Patch) to execute rest operation by setting Request object. Request object can hold information (http method, resource url, request payload)

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `request` | `VCFARestRequest` |  |

**Returns:** `VCFARestResponse`

---

## VCFAHost

**Description:** VMware Cloud Foundation Automation Host provides access to connection host properties & validation access.

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `apiToken` |  | `String` | Yes |
| `projectService` |  | `VCFAProjectService` | Yes |
| `displayName` | DisplayName for the Connection Host. | `String` | Yes |
| `name` | Host Connection Name | `String` | Yes |
| `host` | Host URL for the Automation Host Connection. | `String` | Yes |
| `cciService` |  | `VCFACciService` | Yes |
| `id` | Host Id. | `String` | Yes |
| `sessionMode` | Session Mode of the Automation Host Connection (Shared Session or Per User Session). | `String` | Yes |
| `catalogResourceService` |  | `VCFACatalogResourceService` | Yes |
| `tenant` |  | `String` | Yes |
| `k8sApiVersion` |  | `String` | Yes |

### Methods

#### `VCFAHost`
Automation Host No Argument Constructor.

**Returns:** `void`

---

#### `destroy`
Destroys the connection object

**Returns:** `void`

---

#### `validate`
Validates the Host Connection

**Returns:** `Boolean`

---

#### `createRestClient`
Creates a generic REST client for Automation Host

**Returns:** `VCFAGenericRestClient`

---

## VCFAHostManager

**Description:** HostManager provides all the CRUD operations for VMware Cloud Foundation Automation Plugin along with Generic Rest Client support.

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `defaultHostData` | Default Host Connection. | `VCFAHost` | Yes |

### Methods

#### `save`
Save Automation Host object.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `props` | `Object` |  |

**Returns:** `String`

---

#### `update`
Update Automation Host object.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `props` | `Object` |  |
| `host` | `VCFAHost` |  |

**Returns:** `void`

---

#### `createHost`
Creates a dynamic Automation Host.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `properties` | `Object` |  |

**Returns:** `VCFAHost`

---

#### `createHostForCurrentUser`
Creates a temporary host with the current user host and credentials.

**Returns:** `VCFAHost`

---

#### `delete`
Delete Automation Host.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `host` | `VCFAHost` |  |

**Returns:** `void`

---

#### `validate`
Validate Automation Host.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `host` | `VCFAHost` |  |

**Returns:** `Boolean`

---

#### `getHostBySid`
Get Automation Host by Sid.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sid` | `String` |  |

**Returns:** `VCFAHost`

---

## VCFAPrincipal

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `type` |  | `String` | No |
| `email` |  | `String` | No |

## VCFAProject

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `sharedResources` |  | `Boolean` | No |
| `internalIdString` |  | `String` | Yes |
| `host` |  | `VCFAHost` | No |
| `name` |  | `String` | No |
| `description` |  | `String` | No |
| `id` |  | `String` | No |
| `administrators` |  | `Array/VCFAPrincipal` | No |

## VCFAProjectService

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `projects` |  | `Array/Object` | Yes |
| `projects_internal` |  | `Array/Object` | Yes |

### Methods

#### `VCFAProjectService`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `host` | `VCFAHost` |  |

**Returns:** `void`

---

#### `getProject_internal`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `String` |  |

**Returns:** `VCFAProject`

---

#### `getProject`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `id` | `String` |  |

**Returns:** `VCFAProject`

---

## VCFARestRequest

**Description:** Represents a request object for VMware Cloud Foundation Automation API.

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `path` |  | `String` | No |
| `method` |  | `String` | No |
| `payload` |  | `String` | No |

### Methods

#### `getHeader`
Gets Http Header value for the key from the Http Request.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `header` | `String` |  |

**Returns:** `String`

---

#### `setHeader`
Sets Headers to the Http Request Object.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

## VCFARestResponse

**Description:** Utility class used for VMware Cloud Foundation Automation API server response.

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `contentAsString` | The Server's response body as string. | `String` | Yes |
| `allHeaders` | Retrieves the server's response headers as a Properties object. | `Properties` | Yes |
| `contentLength` | The Server's response content length. | `Number` | Yes |
| `statusMessage` | The Server's response status message. | `String` | Yes |
| `statusCode` | The Server's response status code. | `Number` | Yes |

### Methods

#### `getHeaderValues`
Retrieves the server's response header values per header with specific name.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `headerName` | `String` |  |

**Returns:** `Array/String`

---

## VCFASupervisorNamespace

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `internalIdString` |  | `String` | Yes |
| `host` |  | `VCFAHost` | No |
| `name` |  | `String` | Yes |
| `projectName` |  | `String` | Yes |
| `projectId` |  | `String` | Yes |
| `k8sId` |  | `String` | Yes |

## VCFASupervisorResource

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `apiVersion` |  | `String` | No |
| `kind` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `host` |  | `VCFAHost` | No |
| `name` |  | `String` | Yes |
| `namespace` |  | `String` | Yes |
| `id` |  | `String` | No |
| `projectName` |  | `String` | Yes |
| `projectId` |  | `String` | Yes |

