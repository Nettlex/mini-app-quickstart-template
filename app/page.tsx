"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { sdk } from '@farcaster/miniapp-sdk';
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
  WalletDropdownBasename,
  WalletDropdownFundLink
} from '@coinbase/onchainkit/wallet';
import {
  Identity,
  Avatar,
  Name,
  Address,
  EthBalance
} from '@coinbase/onchainkit/identity';
import ProvablyFairGame from "./components/ProvablyFairGame";

export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isInMiniapp, setIsInMiniapp] = useState(false);
  const [farcasterAddress, setFarcasterAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
    // Call Farcaster SDK ready to hide loading splash screen
    sdk.actions.ready().catch(console.error);
    
    // Check if we're in a Farcaster miniapp context and try to get wallet
    sdk.context
      .then((context) => {
        if (context) {
          setIsInMiniapp(true);
          console.log('Farcaster miniapp context:', context);
          // If we have a custody address in context, try to use it
          if (context.user?.custodyAddress) {
            const custodyAddr = context.user.custodyAddress as `0x${string}`;
            setFarcasterAddress(custodyAddr);
            console.log('Farcaster custody address:', custodyAddr);
            
            // Try to connect using injected connector if available
            if (!isConnected) {
              const injectedConnector = connectors.find(c => c.id === 'injected' || c.id === 'metaMask' || c.id === 'coinbaseWalletSDK');
              if (injectedConnector) {
                try {
                  connect({ connector: injectedConnector });
                } catch (err) {
                  console.log('Could not auto-connect:', err);
                }
              }
            }
          }
        }
      })
      .catch((err) => {
        // Not in miniapp context, that's fine
        console.log('Not in Farcaster miniapp context:', err);
        setIsInMiniapp(false);
      });
  }, [setFrameReady, isFrameReady, isConnected, connect, connectors]);

  // Auto-hide welcome screen after 3 seconds or when wallet connects
  useEffect(() => {
    if (isConnected) {
      setShowWelcome(false);
    } else {
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  if (showWelcome) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="text-8xl animate-pulse">🔫</div>
          <h1 className="text-5xl font-bold text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
            RUSSIAN ROULETTE
          </h1>
          <p className="text-xl text-gray-400">
            Provably Fair • High Stakes
          </p>
          
          {/* Connection Options */}
          <div className="space-y-4 pt-4">
            {/* Base Wallet Connect */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-3 text-center">
                {isInMiniapp ? 'Wallet (Farcaster)' : 'Connect with Base'}
              </p>
              {isInMiniapp && farcasterAddress && !isConnected ? (
                // In Farcaster miniapp - show address directly since modal won't work
                <div className="w-full">
                  <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 mb-2">
                    <p className="text-xs text-green-400 mb-1">Farcaster Wallet</p>
                    <p className="text-sm font-mono text-white break-all">
                      {farcasterAddress.slice(0, 6)}...{farcasterAddress.slice(-4)}
                    </p>
                  </div>
                  <p className="text-xs text-yellow-400 text-center">
                    Note: Wallet connection in iframe is limited. You can still play for free!
                  </p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Wallet>
                    <ConnectWallet className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2">
                    <svg className="h-5 w-5" viewBox="0 0 111 111" fill="none">
                      <path d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z" fill="white"/>
                    </svg>
                    <Name />
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                      <Avatar />
                      <Name />
                      <Address />
                      <EthBalance />
                    </Identity>
                    <WalletDropdownBasename />
                    <WalletDropdownLink icon="wallet" href="https://wallet.coinbase.com">
                      Wallet
                    </WalletDropdownLink>
                    <WalletDropdownFundLink />
                    <WalletDropdownDisconnect />
                  </WalletDropdown>
                </Wallet>
                </div>
              )}
              {isInMiniapp && !isConnected && (
                <p className="text-xs text-yellow-400 mt-2 text-center">
                  In Farcaster miniapp - wallet should auto-connect
                </p>
              )}
              {!isInMiniapp && !isConnected && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Click to connect your wallet
                </p>
              )}
            </div>

            {/* Farcaster Login */}
            <div className="bg-purple-900/20 border border-purple-700 rounded-xl p-6">
              <p className="text-sm text-gray-400 mb-3 text-center">Add to Farcaster</p>
              <button 
                onClick={() => {
                  // TODO: Implement Farcaster auth
                  console.log('🟣 Farcaster login');
                  alert('Farcaster integration coming soon! For now, use wallet connect.');
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span className="text-xl">🟣</span>
                <span>Login with Farcaster</span>
              </button>
              <p className="text-xs text-purple-300 mt-2 text-center">
                Add this mini app to your Farcaster apps
              </p>
            </div>
          </div>

          {/* Skip Option */}
          <button
            onClick={() => setShowWelcome(false)}
            className="text-sm text-gray-500 hover:text-gray-300 underline transition-all"
          >
            Skip and play for free →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main Game - Provably Fair */}
      <ProvablyFairGame />
    </div>
  );
}
