import { Dialog, Transition } from "@headlessui/react";
import { WaiverStatus } from "@prisma/client";
import { Fragment } from "react";

const WaiverModal = ({
  isOpen,
  onClose,
  imageUrl,
  changeWaiverStatus,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  changeWaiverStatus: (status: WaiverStatus) => void;
}) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="absolute top-1 right-3"
                  >
                    x
                  </button>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <img src={imageUrl} alt="signed waiver" />
                  </Dialog.Title>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        changeWaiverStatus(WaiverStatus.APPROVED);
                        onClose();
                      }}
                      className="rounded-md border-2 border-black px-2 py-1 hover:bg-black hover:text-white"
                    >
                      ✅ Approve
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        changeWaiverStatus(WaiverStatus.NOT_SIGNED);
                        onClose();
                      }}
                      className="rounded-md border-2 border-black px-2 py-1 hover:bg-black hover:text-white"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default WaiverModal;
