import React from 'react';

type ListProps<T> = { [name: string]: any } & {
  children: (item: T, key: string | number) => React.ReactNode;
  getKey: (item: T) => string | number;
  data: T[];
};

export default function ListPagination<T>({
  children: renderItem,
  getKey,
  data,
  ...props
}: ListProps<T>) {
  // console.log(data.constructor.prototype);
  return <div {...props}>{data.map((el) => renderItem(el, getKey(el)))}</div>;
}
