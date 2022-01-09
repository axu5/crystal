import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { isServer } from "../utils/isServer";

export default function Checkout() {
  const router = useRouter();
  const { status } = router.query;

  console.log(router.query);

  return (
    <>
      <>
        <title>Checkout</title>
      </>
      <div className='flex flex-row w-96 justify-center'>
        {status && status === "success" && (
          <div className='bg-green-100 text-green-700 p-2 rounded border mb-2 border-green-700'>
            Payment Successful
          </div>
        )}
        {status && status === "cancel" && (
          <div className='bg-red-100 text-red-700 p-2 rounded border mb-2 border-red-700'>
            Payment Unsuccessful
          </div>
        )}
      </div>
    </>
  );
}
