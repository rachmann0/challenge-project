import React, { useState } from 'react';
import { usePopper } from 'react-popper';

type TooltipProps = {
  // handleDetails: () => any;
  // handleEdit: () => any;
  handleDelete: () => any;
};

// const Tooltip = ({ handleDetails, handleEdit, handleDelete }: TooltipProps) => {
const Tooltip = ({ handleDelete }: TooltipProps) => {
  const [referenceElement, setReferenceElement] =
    useState<SVGSVGElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  });

  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      <svg
        ref={setReferenceElement}
        onClick={() => setisOpen(!isOpen)}
        className='w-6 h-6 cursor-pointer'
        data-darkreader-inline-fill=''
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
      </svg>
      <div
        className={`text-sm flex flex-col items-start bg-white p-3 shadow-lg rounded ${
          isOpen ? '' : 'hidden'
        }`}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {/* <button onClick={handleDetails}>Details</button>
        <button onClick={handleEdit}>Edit</button> */}
        <button onClick={handleDelete}>Delete</button>
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
  );
};
export default Tooltip;
