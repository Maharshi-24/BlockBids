# Custom Wallet Detection and Integration

## Overview
This document outlines how BlockBids detects and integrates with custom wallet extensions, specifically focusing on WalletX and 1inch wallet implementations.

## Detection Methods

### 1. Initial Provider Detection
```typescript
useEffect(() => {
  if (window.ethereum) {
    console.log("Detected provider:", window.ethereum);
    setHasCustomWallet(true);
  }
}, []);
```
- Checks for the presence of `window.ethereum` object
- Logs the detected provider for debugging
- Sets a state flag indicating custom wallet availability

### 2. Multiple Provider Detection
```typescript
if (window.ethereum?.providers) {
  console.log("Multiple providers detected. Looking for custom wallet...");
  
  // Look for custom wallet first
  let customProvider = null;
  
  for (const provider of window.ethereum.providers) {
    if (provider.isWalletX || provider.is1inch || 
        (provider !== window.ethereum && !provider.isBraveWallet)) {
      customProvider = provider;
      console.log("Found custom wallet provider:", provider);
      break;
    }
  }
}
```
- Detects multiple wallet providers in the browser
- Specifically identifies WalletX and 1inch wallets
- Excludes Brave Wallet to prevent conflicts
- Logs the found custom provider for debugging

## Provider Properties

### WalletX Detection
- `isWalletX: true` - Primary identifier
- `_walletName: 'WalletX'` - Additional identifier
- `isMetaMask: true` - May be present due to compatibility layer

### 1inch Wallet Detection
- `is1inch: true` - Primary identifier
- Compatible with standard Ethereum provider interface

## Connection Flow

### 1. Direct Connection Method
```typescript
const handleDirectConnect = async () => {
  // Add delay for wallet initialization
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Request accounts with timeout
  const accountsPromise = customProvider.request({
    method: 'eth_requestAccounts',
    params: []
  });

  // 25-second timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Connection timeout')), 25000);
  });

  const accounts = await Promise.race([accountsPromise, timeoutPromise]);
}
```
- Implements a 1-second delay for wallet initialization
- Uses a 25-second timeout for connection requests
- Handles connection timeouts gracefully

### 2. Alternative Connection Method
```typescript
// Force inject provider temporarily
const originalEthereum = window.ethereum;
window.ethereum = customProvider;

// Connect with wagmi
for (const connector of connectors) {
  if (connector.id === 'injected') {
    await connect({ connector });
    break;
  }
}

// Restore original provider
window.ethereum = originalEthereum;
```
- Temporarily swaps the window.ethereum provider
- Connects using wagmi's injected connector
- Restores the original provider after connection

## Error Handling

### 1. Connection Errors
```typescript
catch (error) {
  if (error.message?.includes('rejected') || error.code === 4001) {
    toast.error('Connection rejected', {
      description: 'You rejected the wallet connection request'
    });
  } else if (error.message?.includes('timeout')) {
    toast.error('Connection timeout', {
      description: 'The wallet connection request timed out. Please try again.'
    });
  } else if (error.message?.includes('message port closed')) {
    toast.error('Connection timeout', {
      description: 'The wallet connection request timed out. Please try again.'
    });
  }
}
```
- Handles user rejections
- Manages connection timeouts
- Handles message port closure errors

### 2. Provider State Management
- Maintains original provider state
- Handles provider restoration
- Manages connection state in wagmi

## Debugging

### Console Logging
```typescript
console.log("Detected provider:", window.ethereum);
console.log("Multiple providers detected. Looking for custom wallet...");
console.log("Found custom wallet provider:", provider);
console.log("Requesting accounts from custom wallet provider...");
console.log("Received accounts:", accounts);
```
- Logs provider detection
- Logs connection attempts
- Logs successful connections
- Logs error states

## Best Practices

1. **Provider Detection**
   - Always check for multiple providers
   - Prioritize custom wallets over browser wallets
   - Log provider information for debugging

2. **Connection Handling**
   - Implement timeouts for connection requests
   - Handle provider state properly
   - Provide clear user feedback

3. **Error Management**
   - Handle all possible error cases
   - Provide user-friendly error messages
   - Implement proper cleanup

4. **State Management**
   - Maintain provider state
   - Handle connection state
   - Clean up after disconnection

## Common Issues and Solutions

1. **Message Port Closure**
   - Implement longer timeouts
   - Add retry mechanism
   - Provide clear user feedback

2. **Provider Conflicts**
   - Prioritize custom wallets
   - Handle multiple providers
   - Manage provider state

3. **Connection Timeouts**
   - Use appropriate timeout values
   - Implement fallback methods
   - Provide clear user feedback

## Future Improvements

1. **Provider Detection**
   - Add support for more custom wallets
   - Improve provider prioritization
   - Enhance detection reliability

2. **Connection Handling**
   - Implement connection retry logic
   - Add connection state persistence
   - Improve error recovery

3. **User Experience**
   - Add connection progress indicators
   - Improve error messages
   - Enhance feedback mechanisms 