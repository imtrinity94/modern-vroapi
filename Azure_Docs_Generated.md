# Azure Reference

**Version:** 1.3.0.24648698  
**Download Link:** [Broadcom Knowledge Base](https://knowledge.broadcom.com/external/article/391736/azure-plugin-fails-to-load-on-aria-autom.html)

Generated Documentation

## AzureAvailabilitySet

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `platformFaultDomainCount` |  | `String` | No |
| `displayName` |  | `String` | Yes |
| `platformUpdateDomainCount` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `id` |  | `String` | No |
| `type` |  | `String` | No |
| `region` |  | `String` | No |

## AzureAvailabilitySetManager

### Methods

#### `getAvailabilitySetByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzureAvailabilitySet`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `availabilitySet` | `AzureAvailabilitySet` |  |

**Returns:** `void`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `availabilitySetName` | `String` |  |
| `isManaged` | `Boolean` |  |
| `faultDomain` | `Number` |  |
| `updateDomain` | `Number` |  |

**Returns:** `AzureAvailabilitySet`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `availabilitySet` | `AzureAvailabilitySet` |  |

**Returns:** `Array/String`

---

#### `getAvailabilitySetById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureAvailabilitySet`

---

#### `getAvailabilitySetByResourceGroupAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `name` | `String` |  |

**Returns:** `AzureAvailabilitySet`

---

#### `toggleSkuType`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `availabilitySet` | `AzureAvailabilitySet` |  |

**Returns:** `AzureAvailabilitySet`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `availabilitySet` | `AzureAvailabilitySet` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `getAllAvailabilitySetByTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `Array/AzureAvailabilitySet`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `availabilitySet` | `AzureAvailabilitySet` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

## AzureConnection

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `clientId` |  | `String` | Yes |
| `serviceUri` |  | `String` | Yes |
| `proxyUsername` |  | `String` | Yes |
| `displayName` |  | `String` | Yes |
| `azureEnvironment` |  | `String` | Yes |
| `proxyHost` |  | `String` | Yes |
| `proxyPort` |  | `Number` | Yes |
| `customProperties` |  | `String` | Yes |
| `loginUrl` |  | `String` | Yes |
| `tenantId` |  | `String` | Yes |
| `storageUri` |  | `String` | Yes |
| `name` |  | `String` | Yes |
| `subscriptionId` |  | `String` | Yes |

### Methods

#### `destroy`


**Returns:** `void`

---

#### `validate`
Uses the azure connection to get a resource group to validate the connection.

**Returns:** `void`

---

## AzureConnectionManager

### Methods

#### `putCall`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `urlPath` | `String` |  |
| `body` | `String` |  |

**Returns:** `String`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |

**Returns:** `void`

---

#### `getCall`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `urlPath` | `String` |  |

**Returns:** `String`

---

#### `saveFromResource`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `props` | `Object` |  |
| `resource` | `ResourceElement` |  |

**Returns:** `String`

---

#### `getConnectionBySid`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sid` | `String` |  |

**Returns:** `AzureConnection`

---

#### `deleteCall`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `urlPath` | `String` |  |

**Returns:** `String`

---

#### `save`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `props` | `Object` |  |
| `keystoreLocation` | `String` |  |

**Returns:** `String`

---

#### `postCall`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `urlPath` | `String` |  |
| `body` | `String` |  |

**Returns:** `String`

---

#### `patchCall`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `urlPath` | `String` |  |
| `body` | `String` |  |

**Returns:** `String`

---

#### `saveFromPem`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `props` | `Object` |  |
| `privateKey` | `String` |  |
| `certificate` | `String` |  |

**Returns:** `String`

---

#### `update`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `props` | `Object` |  |
| `connection` | `AzureConnection` |  |

**Returns:** `void`

---

## AzureDatabaseManager

### Methods

#### `createDatabaseFromSourceDb`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `databaseName` | `String` |  |
| `sourceDatabase` | `AzureSqlDatabase` |  |
| `createMode` | `String` |  |

**Returns:** `AzureSqlDatabase`

---

#### `listTagsForSqlServer`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |

**Returns:** `Array/String`

---

#### `getDatabaseInElasticPool`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `elasticPoolName` | `String` |  |

**Returns:** `Array/AzureSqlDatabase`

---

#### `deleteElasticPool`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `elasticPoolName` | `String` |  |
| `propsJson` | `String` |  |

**Returns:** `void`

---

#### `deleteSQLServer`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |

**Returns:** `void`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlDatabase` | `AzureSqlDatabase` |  |
| `sqlServer` | `AzureSqlServer` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `addTagForSqlServer`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `getSqlServerById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureSqlServer`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlDatabase` | `AzureSqlDatabase` |  |
| `sqlServer` | `AzureSqlServer` |  |

**Returns:** `Array/String`

---

#### `removeDatabaseFromElasticPool`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `database` | `AzureSqlDatabase` |  |

**Returns:** `void`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlDatabase` | `AzureSqlDatabase` |  |
| `sqlServer` | `AzureSqlServer` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `deleteDatabase`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `database` | `AzureSqlDatabase` |  |

**Returns:** `void`

---

#### `toggleAccessFromAzureServices`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `enable` | `Boolean` |  |

**Returns:** `void`

---

#### `createSQLServer`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `sqlServerName` | `String` |  |
| `administratorLogin` | `String` |  |
| `administratorPassword` | `String` |  |

**Returns:** `AzureSqlServer`

---

#### `changeSQLServerAdminPwd`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `administratorPassword` | `String` |  |

**Returns:** `void`

---

#### `createDatabase`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `databaseName` | `String` |  |
| `databaseEdition` | `String` |  |
| `serviceObject` | `String` |  |
| `storageSize` | `String` |  |
| `collation` | `String` |  |

**Returns:** `AzureSqlDatabase`

---

#### `removeTagForSqlServer`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `sqlServer` | `AzureSqlServer` |  |
| `key` | `String` |  |

**Returns:** `void`

---

## AzureDeployment

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |

## AzureDisk

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `attachedToVirtualMachine` |  | `Boolean` | No |
| `sizeInGB` |  | `Number` | No |
| `internalIdString` |  | `String` | Yes |
| `osType` |  | `String` | No |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `timeCreated` |  | `String` | No |
| `azureId` |  | `String` | No |
| `type` |  | `String` | No |
| `region` |  | `String` | No |

## AzureDiskManager

### Methods

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `disk` | `AzureDisk` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `disk` | `AzureDisk` |  |

**Returns:** `void`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `disk` | `AzureDisk` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `disk` | `AzureDisk` |  |

**Returns:** `Array/String`

---

#### `createDiskFromSnapshot`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `diskName` | `String` |  |
| `diskSizeInGB` | `Number` |  |
| `snapshot` | `AzureSnapshot` |  |
| `accountType` | `String` |  |

**Returns:** `AzureDisk`

---

#### `getDiskById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureDisk`

---

#### `createEmptyDisk`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `diskName` | `String` |  |
| `diskSizeInGB` | `Number` |  |
| `accountType` | `String` |  |

**Returns:** `AzureDisk`

---

#### `createDiskFromVhd`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `diskName` | `String` |  |
| `diskSizeInGB` | `Number` |  |
| `osType` | `String` |  |
| `vhdURI` | `String` |  |
| `accountType` | `String` |  |
| `storageAccountName` | `String` |  |

**Returns:** `AzureDisk`

---

## AzureDnsZone

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `nameServers` |  | `String` | No |
| `type` |  | `String` | No |
| `region` |  | `String` | No |

## AzureExtensionManager

### Methods

#### `runCustomScriptExtPublicConfig`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `extensionName` | `String` |  |
| `scriptPaths` | `Array/String` |  |
| `command` | `String` |  |
| `minorUpgrade` | `Boolean` |  |

**Returns:** `void`

---

#### `detachCustomScriptExtension`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `extensionName` | `String` |  |

**Returns:** `void`

---

#### `runVMAccess`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `extensionName` | `String` |  |
| `props` | `String` |  |

**Returns:** `void`

---

#### `runCustomScriptExtProtectedConfig`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `extensionName` | `String` |  |
| `scriptPaths` | `Array/String` |  |
| `command` | `String` |  |
| `storageAccountName` | `String` |  |
| `storageAccountKey` | `String` |  |
| `minorUpgrade` | `Boolean` |  |

**Returns:** `void`

---

## AzureLoadBalancer

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `publicIpAddress` |  | `String` | No |
| `resourceGuid` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `etag` |  | `String` | No |
| `azureId` |  | `String` | No |
| `provisioningState` |  | `String` | No |
| `type` |  | `String` | No |
| `region` |  | `String` | No |

## AzureLoadBalancerManager

### Methods

#### `removeNatRule`
Remove inbound NAT rule.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `natRuleName` | `String` |  |

**Returns:** `void`

---

#### `getLoadBalancerByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzureLoadBalancer`

---

#### `removeFrontEnd`
Remove frontend.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `frontendName` | `String` |  |

**Returns:** `void`

---

#### `getAllLoadBalancerByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzureLoadBalancer`

---

#### `addLoadBalancerInboundNatRule`
Add inbound nat rule.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `natRuleName` | `String` |  |
| `natFrontEndport` | `Number` |  |
| `natBackendPort` | `Number` |  |
| `frontEndName` | `String` |  |
| `floatingIpEnabled` | `Boolean` |  |
| `idleTimeoutInMinutes` | `Number` |  |

**Returns:** `AzureLoadBalancer`

---

#### `addTcpProbe`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `probeName` | `String` |  |
| `interval` | `Number` |  |
| `port` | `Number` |  |
| `probes` | `Number` |  |

**Returns:** `void`

---

#### `createExternalFacingLoadBalancer`
Create external load balancer.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `lbName` | `String` |  |
| `lbRuleName` | `String` |  |
| `transportProtocol` | `String` |  |
| `frontEndport` | `Number` |  |
| `backendPort` | `Number` |  |
| `probeName` | `String` |  |
| `requestPath` | `String` |  |
| `probeInterval` | `Number` |  |
| `probeThreshold` | `Number` |  |
| `floatingIpEnabled` | `Boolean` |  |
| `idleTimeoutInMinutes` | `Number` |  |
| `loadDistributionMode` | `String` |  |
| `publicIp` | `AzurePublicIPAddress` |  |
| `frontEndName` | `String` |  |
| `backendName` | `String` |  |

**Returns:** `AzureLoadBalancer`

---

#### `attachNicToLoadBalancerBackendPool`
Ensure that availability set and virtual network are same.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `backendPoolName` | `String` |  |
| `vNic` | `AzureNetworkInterface` |  |

**Returns:** `void`

---

#### `removeProbe`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `probeName` | `String` |  |

**Returns:** `void`

---

#### `addHttpProbe`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `probeName` | `String` |  |
| `requestPath` | `String` |  |
| `interval` | `Number` |  |
| `port` | `Number` |  |
| `probes` | `Number` |  |

**Returns:** `void`

---

#### `getLoadBalancerBackendPool`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |

**Returns:** `Array/String`

---

#### `deleteLoadBalancer`
Delete load balancer.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |

**Returns:** `void`

---

#### `addLoadBalancerPublicFrontEnd`
Add public frontend.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `frontEndName` | `String` |  |
| `publicIp` | `AzurePublicIPAddress` |  |

**Returns:** `AzureLoadBalancer`

---

#### `createInternalFacingLoadBalancer`
Create internal load balancer.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `lbName` | `String` |  |
| `lbRuleName` | `String` |  |
| `natRuleName` | `String` |  |
| `transportProtocol` | `String` |  |
| `frontEndport` | `Number` |  |
| `backendPort` | `Number` |  |
| `natFrontEndport` | `Number` |  |
| `natBackendPort` | `Number` |  |
| `probeName` | `String` |  |
| `requestPath` | `String` |  |
| `probeInterval` | `Number` |  |
| `probeThreshold` | `Number` |  |
| `floatingIpEnabled` | `Boolean` |  |
| `idleTimeoutInMinutes` | `Number` |  |
| `loadDistributionMode` | `String` |  |
| `frontEndName` | `String` |  |
| `backendName` | `String` |  |
| `network` | `AzureVirtualNetwork` |  |
| `subnet` | `AzureSubnet` |  |
| `privateIp` | `String` |  |

**Returns:** `AzureLoadBalancer`

---

#### `removeBackend`
Remove backend.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `backendName` | `String` |  |

**Returns:** `void`

---

#### `removeLoadBalancerRule`
Remove load balancing rule.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `ruleName` | `String` |  |

**Returns:** `void`

---

#### `addLoadBalancerPrivateFrontEnd`
Add private front end.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `frontEndName` | `String` |  |
| `network` | `AzureVirtualNetwork` |  |
| `subnetName` | `String` |  |
| `privateIp` | `String` |  |

**Returns:** `AzureLoadBalancer`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |

**Returns:** `Array/String`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `addLoadBalancerRule`
Add loadbalancing rule.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `loadBalancer` | `AzureLoadBalancer` |  |
| `lbRuleName` | `String` |  |
| `transportProtocol` | `String` |  |
| `frontEndport` | `Number` |  |
| `backendPort` | `Number` |  |
| `probeName` | `String` |  |
| `requestPath` | `String` |  |
| `probeInterval` | `Number` |  |
| `probeThreshold` | `Number` |  |
| `floatingIpEnabled` | `Boolean` |  |
| `idleTimeoutInMinutes` | `Number` |  |
| `loadDistributionMode` | `String` |  |
| `frontEndName` | `String` |  |
| `backendName` | `String` |  |

**Returns:** `AzureLoadBalancer`

---

#### `getLoadBalancerByResourceGroupAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `name` | `String` |  |

**Returns:** `AzureLoadBalancer`

---

## AzureLockManager

### Methods

#### `getLocks`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `Array/String`

---

#### `addLock`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |
| `lockName` | `String` |  |
| `lockType` | `String` |  |

**Returns:** `String`

---

#### `removeLock`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `lockId` | `String` |  |

**Returns:** `void`

---

## AzureNetworkInterface

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `displayName` |  | `String` | No |
| `regionName` |  | `String` | No |
| `dnsName` |  | `String` | No |
| `type` |  | `String` | No |
| `primaryVirtualNetworkId` |  | `String` | No |
| `attachedToVm` |  | `String` | No |
| `dnsServerIps` |  | `String` | No |
| `isPrimary` |  | `Boolean` | No |
| `internalIdString` |  | `String` | Yes |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `acceleratedNetworkEnabled` |  | `Boolean` | No |
| `networkSecurityGroup` |  | `String` | No |
| `publicIpAddressName` |  | `String` | No |
| `resourceGroupName` |  | `String` | No |
| `fqdn` |  | `String` | No |
| `publicIpAddress` |  | `String` | No |
| `privateAllocationMethod` |  | `String` | No |
| `ipForwardingEnabled` |  | `Boolean` | No |
| `provisioningState` |  | `String` | No |
| `privateIpAddress` |  | `String` | No |
| `tags` |  | `String` | No |
| `appliedDnsServers` |  | `String` | No |
| `macAddress` |  | `String` | No |
| `primarySubnet` |  | `String` | No |
| `name` |  | `String` | No |
| `domainNameSuffix` |  | `String` | No |

## AzureNetworkInterfaceManager

### Methods

#### `getAllVirtualNetworkByTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `Array/AzureNetworkInterface`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vNetwork` | `AzureVirtualNetwork` |  |
| `subnet` | `AzureSubnet` |  |
| `publicIPAddress` | `AzurePublicIPAddress` |  |
| `networkInterfaceName` | `String` |  |
| `staticPrivateIPAddress` | `String` |  |

**Returns:** `AzureNetworkInterface`

---

#### `attachNetworkSecurityGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |
| `networkSecurityGroup` | `AzureNetworkSecurityGroup` |  |

**Returns:** `AzureNetworkInterface`

---

#### `attachPublicIpAddress`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |
| `publicIpAddress` | `AzurePublicIPAddress` |  |

**Returns:** `AzureNetworkInterface`

---

#### `toggleNicIpAllocationType`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |
| `staticAllocation` | `Boolean` |  |

**Returns:** `void`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |

**Returns:** `Array/String`

---

#### `getNetworkInterfaceByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzureNetworkInterface`

---

#### `getPrimaryNetworkInterfaceByVirtualMachine`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `AzureNetworkInterface`

---

#### `getVirtualNetworkById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureNetworkInterface`

---

#### `getNetworkInterfaceByResourceGroupAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `name` | `String` |  |

**Returns:** `AzureNetworkInterface`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |

**Returns:** `void`

---

#### `createWithoutPublicIp`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vNetwork` | `AzureVirtualNetwork` |  |
| `subnet` | `AzureSubnet` |  |
| `networkInterfaceName` | `String` |  |
| `staticPrivateIPAddress` | `String` |  |

**Returns:** `AzureNetworkInterface`

---

#### `detachPublicIpAddress`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkInterface` | `AzureNetworkInterface` |  |

**Returns:** `AzureNetworkInterface`

---

#### `getAllSecondaryNetworkInterfaceByVirtualMachine`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `Array/AzureNetworkInterface`

---

## AzureNetworkSecurityGroup

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `resourceGuid` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `etag` |  | `String` | No |
| `azureId` |  | `String` | No |
| `provisioningState` |  | `String` | No |
| `type` |  | `String` | No |
| `region` |  | `String` | No |

## AzureNetworkSecurityGroupManager

### Methods

#### `getNetworkSecurityGroupByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzureNetworkSecurityGroup`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `nsg` | `AzureNetworkSecurityGroup` |  |

**Returns:** `Array/String`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `networkSecurityGroupName` | `String` |  |

**Returns:** `AzureNetworkSecurityGroup`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `nsg` | `AzureNetworkSecurityGroup` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `getNetworkSecurityGroupByResourceGroupAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `name` | `String` |  |

**Returns:** `AzureNetworkSecurityGroup`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `nsg` | `AzureNetworkSecurityGroup` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `networkSecurityGroup` | `AzureNetworkSecurityGroup` |  |

**Returns:** `void`

---

## AzurePublicIPAddress

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `resourceGroupName` |  | `String` | No |
| `leafDomain` |  | `String` | No |
| `fqdn` |  | `String` | No |
| `displayName` |  | `String` | No |
| `regionName` |  | `String` | No |
| `ipAddress` |  | `String` | No |
| `provisioningState` |  | `String` | No |
| `type` |  | `String` | No |
| `zones` |  | `String` | No |
| `tags` |  | `String` | No |
| `reverseFqdn` |  | `String` | No |
| `ipAllocationType` |  | `String` | No |
| `ipVersion` |  | `String` | No |
| `availableToUse` |  | `Boolean` | No |
| `internalIdString` |  | `String` | Yes |
| `idleTimeoutMinutes` |  | `Number` | No |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |

## AzurePublicIPAddressManager

### Methods

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `publicIpAddress` | `AzurePublicIPAddress` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `detachPublicIpOfVm`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `create_v2`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `publicIPAddressName` | `String` |  |
| `propsJson` | `String` |  |

**Returns:** `AzurePublicIPAddress`

---

#### `getPublicIpAddressByResourceGroupAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `name` | `String` |  |

**Returns:** `AzurePublicIPAddress`

---

#### `getPublicIpAddressesByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzurePublicIPAddress`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `publicIPAddress` | `AzurePublicIPAddress` |  |

**Returns:** `Array/String`

---

#### `attachPublicIpToVm`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `publicIPAddress` | `AzurePublicIPAddress` |  |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `getAllAvailablePublicIpAddresses`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |

**Returns:** `Array/AzurePublicIPAddress`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `publicIPAddressName` | `String` |  |

**Returns:** `AzurePublicIPAddress`

---

#### `getAvailablePublicIpAddressesByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzurePublicIPAddress`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `publicIPAddress` | `AzurePublicIPAddress` |  |

**Returns:** `void`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `publicIpAddress` | `AzurePublicIPAddress` |  |
| `key` | `String` |  |

**Returns:** `void`

---

## AzureRegion

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `displayName` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |

## AzureRegionManager

### Methods

#### `getRegionByConnectionAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `regionName` | `String` |  |

**Returns:** `AzureRegion`

---

#### `getRegionByConnection`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |

**Returns:** `Array/AzureRegion`

---

## AzureResourceGroup

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `provisiongState` |  | `String` | No |
| `displayName` |  | `String` | Yes |
| `internalIdString` |  | `String` | Yes |
| `regionName` |  | `String` | No |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |

## AzureResourceGroupManager

### Methods

#### `getResourceGroupByConnectionAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `name` | `String` |  |

**Returns:** `AzureResourceGroup`

---

#### `getDeploymentState`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `deploymentName` | `String` |  |

**Returns:** `String`

---

#### `deployArmTemplate`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `deploymentName` | `String` |  |
| `resourceGroup` | `AzureResourceGroup` |  |
| `template` | `String` |  |
| `parameters` | `String` |  |
| `mode` | `String` |  |

**Returns:** `void`

---

#### `deployArmTemplateViaUri`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `deploymentName` | `String` |  |
| `resourceGroup` | `AzureResourceGroup` |  |
| `templateLink` | `String` |  |
| `templateLinkVersion` | `String` |  |
| `parametersLink` | `String` |  |
| `parametersLinkVersion` | `String` |  |
| `mode` | `String` |  |

**Returns:** `void`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/String`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `getAllResourceGroupByTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `Array/AzureResourceGroup`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `region` | `AzureRegion` |  |
| `rgName` | `String` |  |

**Returns:** `AzureResourceGroup`

---

#### `deleteInBackground`
To avoid holding the vro thread on long running task.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `void`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `void`

---

#### `getResourceGroupByConnection`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |

**Returns:** `Array/AzureResourceGroup`

---

## AzureRoute

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `nextHopAddress` |  | `String` | No |
| `routeTable` |  | `String` | No |
| `addressPrefix` |  | `String` | No |
| `nextHopType` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |

## AzureRouteTable

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `routes` |  | `String` | No |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `location` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `subnets` |  | `String` | No |
| `azureId` |  | `String` | No |
| `type` |  | `String` | No |

## AzureRouteTableManager

### Methods

#### `deleteRouteTable`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `routeTable` | `AzureRouteTable` |  |

**Returns:** `void`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `routeTable` | `AzureRouteTable` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `routeTable` | `AzureRouteTable` |  |

**Returns:** `Array/String`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `routeTable` | `AzureRouteTable` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `createRouteTable`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `routeTableName` | `String` |  |

**Returns:** `AzureRouteTable`

---

#### `createRoute`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `routeTable` | `AzureRouteTable` |  |
| `routeName` | `String` |  |
| `addressPerfix` | `String` |  |
| `nextHopType` | `String` |  |
| `applianceIpAddress` | `String` |  |

**Returns:** `AzureRoute`

---

#### `deleteRoute`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `routeTable` | `AzureRouteTable` |  |
| `route` | `AzureRoute` |  |

**Returns:** `void`

---

## AzureSecurityRule

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `access` |  | `String` | No |
| `description` |  | `String` | No |
| `provisioningState` |  | `String` | No |
| `priority` |  | `String` | No |
| `destinationAddressPrefix` |  | `String` | No |
| `protocol` |  | `String` | No |
| `sourcePortRange` |  | `String` | No |
| `sourceAddressPrefix` |  | `String` | No |
| `destinationPortRange` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `etag` |  | `String` | No |
| `azureId` |  | `String` | No |
| `direction` |  | `String` | No |

## AzureSnapshot

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `sourceDisk` |  | `String` | No |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `displayName` |  | `String` | Yes |
| `accountType` |  | `String` | No |
| `type` |  | `String` | No |
| `sizeInGB` |  | `Number` | No |
| `internalIdString` |  | `String` | Yes |
| `osType` |  | `String` | No |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `state` |  | `String` | No |
| `azureId` |  | `String` | No |
| `region` |  | `String` | No |

## AzureSnapshotManager

### Methods

#### `create`
Create a snaphot from disk. Disk cant be attached to VM. You can pass OS or Data disks.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `snapshotName` | `String` |  |
| `sourceDisk` | `AzureDisk` |  |
| `accountType` | `String` |  |

**Returns:** `AzureSnapshot`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `snapshot` | `AzureSnapshot` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `delete`
Deletes a snapshot.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `snapshot` | `AzureSnapshot` |  |

**Returns:** `void`

---

#### `getSnapshotById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureSnapshot`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `snapshot` | `AzureSnapshot` |  |

**Returns:** `Array/String`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `snapshot` | `AzureSnapshot` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `createVMSnapshot`
Snapshot a VM. You can snapshot only managed VM. Determines all disk associated with VM and snapshots them.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `snapshotName` | `String` |  |
| `accountType` | `String` |  |
| `IsDataDiskSnapshotIncluded` | `Boolean` |  |

**Returns:** `Array/AzureSnapshot`

---

## AzureSqlDatabase

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `elasticPoolName` |  | `String` | No |
| `resourceGroupName` |  | `String` | No |
| `secondaryLocation` |  | `String` | No |
| `displayName` |  | `String` | Yes |
| `sqlServerName` |  | `String` | No |
| `regionName` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `collation` |  | `String` | No |
| `databaseId` |  | `String` | No |
| `status` |  | `String` | No |

## AzureSqlServer

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `databases` |  | `Array/Object` | No |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `resourceGroupName` |  | `String` | No |
| `fqdn` |  | `String` | No |
| `displayName` |  | `String` | Yes |
| `kind` |  | `String` | No |
| `elasticPools` |  | `Array/Object` | No |
| `regionName` |  | `String` | No |
| `admin` |  | `String` | No |
| `type` |  | `String` | No |
| `version` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `state` |  | `String` | No |

## AzureStorageAccount

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `creationTime` |  | `String` | No |
| `lastGeoFailoverTime` |  | `String` | No |
| `displayName` |  | `String` | Yes |
| `secondaryLocation` |  | `String` | No |
| `accountType` |  | `String` | No |
| `provisioningState` |  | `String` | No |
| `type` |  | `String` | No |
| `statusOfSecondary` |  | `String` | No |
| `target` |  | `AzureStorageAccount` | No |
| `primaryLocation` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `statusOfPrimary` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `region` |  | `String` | No |

## AzureStorageManager

### Methods

#### `deleteVhdByUri`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `vhdUri` | `String` |  |

**Returns:** `void`

---

#### `restrictAccessByIPRange`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `ipAddressCidr` | `String` |  |
| `restrict` | `Boolean` |  |

**Returns:** `void`

---

#### `toggleFileEncryption`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `enable` | `Boolean` |  |

**Returns:** `void`

---

#### `toggleBlobEncryption`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `enable` | `Boolean` |  |

**Returns:** `void`

---

#### `toggleReadAccessToLoggingFromAnyNetwork`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `restrict` | `Boolean` |  |

**Returns:** `void`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `toggleAccessBySubnet`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `vNetwork` | `AzureVirtualNetwork` |  |
| `subnet` | `AzureSubnet` |  |
| `restrict` | `Boolean` |  |

**Returns:** `void`

---

#### `restrictHttpsAndHttpTraffice`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `httpsOnly` | `Boolean` |  |

**Returns:** `void`

---

#### `toggleReadAccessToMetricsFromAnyNetwork`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `restrict` | `Boolean` |  |

**Returns:** `void`

---

#### `allowAllAccess`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |

**Returns:** `void`

---

#### `toggleAccessWithinAzureServices`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `restrict` | `Boolean` |  |

**Returns:** `void`

---

#### `listAllStorageAccount`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |

**Returns:** `Array/AzureStorageAccount`

---

#### `listStorageAccountByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzureStorageAccount`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |

**Returns:** `Array/String`

---

#### `toggleAccessByIPAddress`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `ipAddress` | `String` |  |
| `restrict` | `Boolean` |  |

**Returns:** `void`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `storageAccountName` | `String` |  |
| `propsJson` | `String` |  |

**Returns:** `AzureStorageAccount`

---

#### `getById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureStorageAccount`

---

#### `checkNameAvailability`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `name` | `String` |  |

**Returns:** `Boolean`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `storageAccount` | `AzureStorageAccount` |  |

**Returns:** `void`

---

## AzureSubnet

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `displayName` |  | `String` | No |
| `addressPrefix` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |

## AzureSubnetManager

### Methods

#### `create`
Ensure address range is different else existing subnet will be returned.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualNetwork` | `AzureVirtualNetwork` |  |
| `subnetName` | `String` |  |
| `addressPrefix` | `String` |  |

**Returns:** `AzureSubnet`

---

#### `getSubnetByVirtualNetwork`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualNetwork` | `AzureVirtualNetwork` |  |

**Returns:** `Array/AzureSubnet`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualNetwork` | `AzureVirtualNetwork` |  |
| `subnet` | `AzureSubnet` |  |

**Returns:** `void`

---

#### `getSubnetByVirtualNetworkAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `subnetName` | `String` |  |
| `virtualNetwork` | `AzureVirtualNetwork` |  |

**Returns:** `AzureSubnet`

---

## AzureVirtualMachine

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `virtualMachineMaxDiskCount` |  | `Number` | No |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `resourceGroupName` |  | `String` | No |
| `publicIpAddress` |  | `String` | No |
| `osDiskUri` |  | `String` | No |
| `displayName` |  | `String` | No |
| `provisioningState` |  | `String` | No |
| `type` |  | `String` | No |
| `primaryPrivateIP` |  | `String` | No |
| `operatingSystem` |  | `String` | No |
| `licenseType` |  | `String` | No |
| `powerState` |  | `String` | No |
| `virtualMachineSize` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `managedDiskEnabled` |  | `Boolean` | No |
| `azureId` |  | `String` | No |
| `subscriptionId` |  | `String` | No |
| `region` |  | `String` | No |
| `virtualMachineResourceDiskSizeMb` |  | `Number` | No |

## AzureVirtualMachineCustomImage

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `sourceVirtualMachine` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `osType` |  | `String` | No |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `region` |  | `String` | No |

## AzureVirtualMachineImage

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `product` |  | `String` | No |
| `displayName` |  | `String` | No |
| `version` |  | `String` | No |
| `operatingSystem` |  | `String` | No |
| `offer` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `publisher` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `sku` |  | `String` | No |
| `region` |  | `String` | No |

## AzureVirtualMachineImageOffer

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `region` |  | `String` | No |

## AzureVirtualMachineImagePublisher

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `region` |  | `String` | No |

## AzureVirtualMachineImageSku

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `region` |  | `String` | No |

## AzureVirtualMachineManager

### Methods

#### `createCustomImage`
Create custom image from VM. Either a unmanagedvm or managed vm can be passed. The resulting image is always managed image. Capturing a virtual machine image will make the virtual machine unusable. This action cannot be undone. If you create an image from a virtual machine that hasn't been generalized, any virtual machines created from that image won't start. De-provision,deallocate,generalize before invoking.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `imageName` | `String` |  |

**Returns:** `AzureVirtualMachineCustomImage`

---

#### `getAvailabilitySetOfVm`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `AzureAvailabilitySet`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `attachNewManagedDisk`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `diskName` | `String` |  |
| `diskSizeInGB` | `Number` |  |
| `lun` | `Number` |  |
| `cachingType` | `String` |  |
| `skuType` | `String` |  |

**Returns:** `void`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `getVmDiskForOs`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `String`

---

#### `powerOff`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `restart`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `capture`
Captures VHD of unamanged VM. Choose this option instead of deleting a VM to release its VHD file. De-provision,deallocate,generalize before invoking

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `containerName` | `String` |  |
| `vhdPrefix` | `String` |  |
| `overwriteVhd` | `Boolean` |  |

**Returns:** `String`

---

#### `getAllVirtualMachineByTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `Array/AzureVirtualMachine`

---

#### `getVmDiskDiskForData`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `Array/String`

---

#### `getPublicIpAddress`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `AzurePublicIPAddress`

---

#### `restartAsync`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vmName` | `String` |  |
| `storageAccount` | `AzureStorageAccount` |  |
| `networkInterface` | `AzureNetworkInterface` |  |
| `isManagedDiskVM` | `Boolean` |  |
| `userName` | `String` |  |
| `passKey` | `String` |  |
| `vmSize` | `AzureVirtualMachineSize` |  |
| `vmImage` | `AzureVirtualMachineImage` |  |
| `availabilitySet` | `AzureAvailabilitySet` |  |
| `osDiskSkuType` | `String` |  |

**Returns:** `AzureVirtualMachine`

---

#### `getVirtualMachineSizesByRegion`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `region` | `AzureRegion` |  |

**Returns:** `Array/AzureVirtualMachineSize`

---

#### `deallocateAsync`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `convertToManaged`
Migrate the virtual machine to use managed disk. deallocate before invoking.

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `deprovisionAgentInLinuxVM`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `host` | `String` |  |
| `port` | `Number` |  |
| `userName` | `String` |  |
| `password` | `String` |  |

**Returns:** `void`

---

#### `generalize`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `Array/String`

---

#### `getVmVhdUriForOs`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `String`

---

#### `deployFromUnmanagedDisk`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vmName` | `String` |  |
| `vmSize` | `AzureVirtualMachineSize` |  |
| `networkInterface` | `AzureNetworkInterface` |  |
| `availabilitySet` | `AzureAvailabilitySet` |  |
| `osType` | `String` |  |
| `diskvHdURI` | `String` |  |

**Returns:** `AzureVirtualMachine`

---

#### `start`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `getCustomImageByName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `imageName` | `String` |  |

**Returns:** `AzureVirtualMachineCustomImage`

---

#### `deployFromImage`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vmName` | `String` |  |
| `userName` | `String` |  |
| `passKey` | `String` |  |
| `networkInterface` | `AzureNetworkInterface` |  |
| `availabilitySet` | `AzureAvailabilitySet` |  |
| `vmCustomImage` | `AzureVirtualMachineCustomImage` |  |
| `vmSize` | `AzureVirtualMachineSize` |  |

**Returns:** `AzureVirtualMachine`

---

#### `deleteAsync`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `deployFromManagedDisk`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vmName` | `String` |  |
| `vmSize` | `AzureVirtualMachineSize` |  |
| `networkInterface` | `AzureNetworkInterface` |  |
| `availabilitySet` | `AzureAvailabilitySet` |  |
| `disk` | `AzureDisk` |  |

**Returns:** `AzureVirtualMachine`

---

#### `getVmVhdUriForData`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `Array/String`

---

#### `powerOffAsync`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `attachBootDiagnosticStorage`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `storageAccount` | `AzureStorageAccount` |  |

**Returns:** `void`

---

#### `detachBootDiagnosticStorage`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `detachDataDisk`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `lun` | `Number` |  |

**Returns:** `void`

---

#### `deleteCustomImage`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `vmCustomImage` | `AzureVirtualMachineCustomImage` |  |

**Returns:** `void`

---

#### `startAsync`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `attachUnmanagedDiskWithExistingVhd`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `diskName` | `String` |  |
| `lun` | `Number` |  |
| `cachingType` | `String` |  |
| `storageAccountName` | `String` |  |
| `containerName` | `String` |  |
| `vhdName` | `String` |  |

**Returns:** `void`

---

#### `getAzureVMSizeByRegionAndSizeName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `regionName` | `String` |  |
| `vmSizeName` | `String` |  |
| `connection` | `AzureConnection` |  |

**Returns:** `AzureVirtualMachineSize`

---

#### `attachUnmanagedDiskWithNewVhd`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `diskName` | `String` |  |
| `diskSizeInGB` | `Number` |  |
| `lun` | `Number` |  |
| `cachingType` | `String` |  |
| `existingStorageAccountName` | `String` |  |
| `existingContainerName` | `String` |  |
| `vhdName` | `String` |  |

**Returns:** `void`

---

#### `createCustomImageFromVhd`
Create custom image from VHD. De-provision,deallocate,generalize before invoking

**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `imageName` | `String` |  |
| `includeDataDisks` | `Boolean` |  |
| `isGeneralized` | `Boolean` |  |

**Returns:** `AzureVirtualMachineCustomImage`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `getVirtualMachineByResourceGroupAndVmName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `vmName` | `String` |  |

**Returns:** `AzureVirtualMachine`

---

#### `cloneFromUnmanagedDisk`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vmName` | `String` |  |
| `vmSize` | `AzureVirtualMachineSize` |  |
| `networkInterface` | `AzureNetworkInterface` |  |
| `availabilitySet` | `AzureAvailabilitySet` |  |
| `osType` | `String` |  |
| `diskVhdUri` | `String` |  |
| `userName` | `String` |  |
| `passKey` | `String` |  |

**Returns:** `AzureVirtualMachine`

---

#### `generalizeAsync`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `getAzureVirtualMachineImage`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `region` | `AzureRegion` |  |
| `publisher` | `String` |  |
| `offer` | `String` |  |
| `sku` | `String` |  |
| `version` | `String` |  |

**Returns:** `AzureVirtualMachineImage`

---

#### `attachExistingManagedDisk`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `disk` | `AzureDisk` |  |

**Returns:** `void`

---

#### `deallocate`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |

**Returns:** `void`

---

#### `attachExistingSecondaryNetworkInterface`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualMachine` | `AzureVirtualMachine` |  |
| `networkInterface` | `AzureNetworkInterface` |  |

**Returns:** `AzureVirtualMachine`

---

#### `getVirtualMachineById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureVirtualMachine`

---

## AzureVirtualMachineSize

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceDiskSizeInMB` |  | `Number` | No |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `maxDataDiskCount` |  | `Number` | No |
| `memoryInMB` |  | `Number` | No |
| `internalIdString` |  | `String` | Yes |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `numberOfCores` |  | `Number` | No |

## AzureVirtualNetwork

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `resourceGuid` |  | `String` | No |
| `displayName` |  | `String` | No |
| `internalIdString` |  | `String` | Yes |
| `addressSpace` |  | `String` | No |
| `name` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `etag` |  | `String` | No |
| `azureId` |  | `String` | No |
| `provisioningState` |  | `String` | No |
| `type` |  | `String` | No |
| `region` |  | `String` | No |

## AzureVirtualNetworkManager

### Methods

#### `getAllVirtualNetworkByTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `Array/AzureVirtualNetwork`

---

#### `getVirtualNetworkByResourceGroup`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |

**Returns:** `Array/AzureVirtualNetwork`

---

#### `listTags`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualNetwork` | `AzureVirtualNetwork` |  |

**Returns:** `Array/String`

---

#### `removeTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualNetwork` | `AzureVirtualNetwork` |  |
| `key` | `String` |  |

**Returns:** `void`

---

#### `getVirtualNetworkByResourceGroupAndName`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `name` | `String` |  |

**Returns:** `AzureVirtualNetwork`

---

#### `create`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `resourceGroup` | `AzureResourceGroup` |  |
| `region` | `AzureRegion` |  |
| `vnetwork` | `String` |  |
| `addressSpace` | `String` |  |
| `subnetName` | `String` |  |
| `subnetAddressSpace` | `String` |  |

**Returns:** `AzureVirtualNetwork`

---

#### `getVirtualNetworkById`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `connection` | `AzureConnection` |  |
| `azureId` | `String` |  |

**Returns:** `AzureVirtualNetwork`

---

#### `addTag`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualNetwork` | `AzureVirtualNetwork` |  |
| `key` | `String` |  |
| `value` | `String` |  |

**Returns:** `void`

---

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `virtualNetwork` | `AzureVirtualNetwork` |  |

**Returns:** `void`

---

## AzureWebApp

### Attributes

| Name | Description | Type | Read-only |
| :--- | :--- | :--- | :--- |
| `resourceGroup` |  | `AzureResourceGroup` | Yes |
| `displayName` |  | `String` | No |
| `repositorySiteName` |  | `String` | No |
| `osName` |  | `String` | No |
| `type` |  | `String` | No |
| `publishingProfile` |  | `String` | No |
| `clientCertEnabled` |  | `Boolean` | No |
| `internalIdString` |  | `String` | Yes |
| `clientAffinityEnabled` |  | `Boolean` | No |
| `name` |  | `String` | No |
| `appServerPlanId` |  | `String` | No |
| `connection` |  | `AzureConnection` | Yes |
| `azureId` |  | `String` | No |
| `state` |  | `String` | No |
| `region` |  | `String` | No |
| `defaultHostName` |  | `String` | No |

## AzureWebAppManager

### Methods

#### `delete`


**Parameters:**
| Name | Type | Description |
| :--- | :--- | :--- |
| `webApp` | `AzureWebApp` |  |

**Returns:** `void`

---

