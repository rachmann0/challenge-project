import React, { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';

type TooltipProps = {
  handleDetails: () => any;
  handleEdit: () => any;
  handleDelete: () => any;
};

const Tooltip = ({ handleDetails, handleEdit, handleDelete }: TooltipProps) => {
  const [referenceElement, setReferenceElement] =
    useState<SVGSVGElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'left-start',
      modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    }
  );

  const [isOpen, setisOpen] = useState(false);

  return (
    <>
      <svg
        ref={setReferenceElement}
        onClick={() => {
          update!();
          setisOpen(!isOpen);
        }}
        className='w-6 h-6 cursor-pointer'
        data-darkreader-inline-fill=''
        fill='currentColor'
        viewBox='0 0 20 20'
      >
        <path d='M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z' />
      </svg>
      <div
        className={`dark:bg-slate-500 dark:text-white text-sm flex flex-col items-start bg-white p-3 shadow-lg rounded ${
          isOpen ? '' : 'hidden'
        }`}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <button
          className='m-1'
          onClick={() => {
            handleDetails();
            setisOpen(false);
          }}
        >
          Details
        </button>
        <button
          className='m-1'
          onClick={() => {
            handleEdit();
            setisOpen(false);
          }}
        >
          Edit
        </button>
        <button
          className='m-1'
          onClick={() => {
            handleDelete();
            setisOpen(false);
          }}
        >
          Delete
        </button>
        <div ref={setArrowElement} style={styles.arrow} />
      </div>
    </>
  );
};
export default Tooltip;
