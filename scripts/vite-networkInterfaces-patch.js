import os from 'node:os';

// Work around rare Node/libuv failures on some systems where
// os.networkInterfaces() throws (uv_interface_addresses).
// Vite calls this to print out server URLs; we only need localhost.
try {
  const original = os.networkInterfaces;
  os.networkInterfaces = () => {
    try {
      return original();
    } catch {
      return {
        lo0: [
          { address: '127.0.0.1', family: 'IPv4', internal: true },
          { address: '::1', family: 'IPv6', internal: true },
        ],
      };
    }
  };
} catch {
  // If patching fails for any reason, do nothing.
}
