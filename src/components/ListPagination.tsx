import React, { MouseEvent } from 'react';

type Props = {
  currentPage: number;
  totalPagesCount: number;
  onSetPage: (v: number) => void
};

const ListPagination: React.FC<Props> = props => {
  if (props.totalPagesCount < 2) {
    return null;
  }

  const range = [];
  for (let i = 0; i < props.totalPagesCount; ++i) {
    range.push(i);
  }

  return (
    <nav>
      <ul className="pagination">

        {
          range.map(v => {
            const isCurrent = v === props.currentPage;
            const onClick = (ev: MouseEvent<HTMLLIElement>) => {
              ev.preventDefault();
              props.onSetPage(v);
            };
            return (
              <li
                className={ isCurrent ? 'page-item active' : 'page-item' }
                onClick={onClick}
                key={v.toString()}
              >

                <a className="page-link" href="">{v + 1}</a>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

export default ListPagination;
