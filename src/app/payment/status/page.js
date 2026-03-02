"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

function LoadingStatus() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Loading Payment Status</h2>
        <p className="text-gray-600">Please wait while we initialize the page...</p>
      </div>
    </div>
  );
}

function PaymentStatusContent() {
  const [processing, setProcessing] = useState(true);
  const [status, setStatus] = useState('processing');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handlePaymentResponse = async () => {
      try {
        const encResp = searchParams.get('encResp');

        if (!encResp) {
          setError('No payment response received');
          setStatus('error');
          setProcessing(false);
          return;
        }

        const response = await fetch('/api/payment/ccavenue-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ encResp })
        });

        const data = await response.json();

        if (data.status && data.data) {
          const paymentInfo = data.data;
          setPaymentData(paymentInfo);

          if (paymentInfo.order_status === 'Success') {
            setStatus('success');
            toast.success('Payment successful!');

            setTimeout(() => {
              const params = new URLSearchParams({
                order_id: paymentInfo.order_id,
                status: 'success',
                ...(paymentInfo.amount && { amount: paymentInfo.amount }),
                ...(paymentInfo.tracking_id && { tracking_id: paymentInfo.tracking_id })
              });
              router.push(`/payment/success?${params.toString()}`);
            }, 2000);
          } else {
            setStatus('failed');
            toast.error('Payment failed: ' + (paymentInfo.failure_message || 'Unknown error'));

            setTimeout(() => {
              const params = new URLSearchParams({
                order_id: paymentInfo.order_id,
                status: 'failed',
                message: paymentInfo.failure_message || 'Payment failed',
                failure_message: paymentInfo.failure_message || 'Payment processing failed',
                status_message: paymentInfo.status_message || 'Failed',
                payment_method: paymentInfo.payment_mode || 'Unified Payments (UPI)',
                ...(paymentInfo.amount && { amount: paymentInfo.amount }),
                ...(paymentInfo.tracking_id && { tracking_id: paymentInfo.tracking_id }),
                ...(paymentInfo.bank_ref_no && { bank_ref_no: paymentInfo.bank_ref_no })
              });
              router.push(`/payment/failed?${params.toString()}`);
            }, 3000);
          }
        } else {
          setStatus('error');
          setError('Invalid payment response');
          toast.error('Invalid payment response');
        }
      } catch (requestError) {
        console.error('Payment processing error:', requestError);
        setStatus('error');
        setError(requestError.message);
        toast.error('Failed to process payment response');
      } finally {
        setProcessing(false);
      }
    };

    handlePaymentResponse();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center items-center px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-8 text-center">
        {processing && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </>
        )}

        {!processing && status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">OK</span>
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
            {paymentData && (
              <div className="text-sm text-gray-500">
                <p>Order ID: {paymentData.order_id}</p>
                <p>Amount: Rs {paymentData.amount}</p>
              </div>
            )}
            <p className="text-sm text-blue-600 mt-4">Redirecting to confirmation page...</p>
          </>
        )}

        {!processing && status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">X</span>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">Unfortunately, your payment could not be processed.</p>
            {paymentData && (
              <div className="text-sm text-gray-500 mb-4">
                <p>Order ID: {paymentData.order_id}</p>
                <p>Reason: {paymentData.failure_message || 'Unknown error'}</p>
              </div>
            )}
            <button
              onClick={() => router.push('/booking')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </>
        )}

        {!processing && status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">Processing Error</h2>
            <p className="text-gray-600 mb-4">{error || 'An error occurred while processing your payment.'}</p>
            <button
              onClick={() => router.push('/booking')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Booking
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<LoadingStatus />}>
      <PaymentStatusContent />
    </Suspense>
  );
}
