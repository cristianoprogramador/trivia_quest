import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const Modal = ({ isOpen, setIsOpen, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center max-h-screen p-4 overflow-auto sm:items-center">
              <Dialog.Panel className="lg:min-w-[550px] max-h-[90%] overflow-y-auto p-4 mx-auto bg-white rounded border-[1px]">
                {children}
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;
