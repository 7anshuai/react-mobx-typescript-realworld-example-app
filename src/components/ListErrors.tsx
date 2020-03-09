import React from 'react';

type Props = {
  errors?: any[]
}

const ListErrors: React.FC<Props> = props => {
  const errors = props.errors;
  if (errors) {
    return (
      <ul className="error-messages">
        {
          Object.keys(errors).map((key: any) => {
            return (
              <li key={key}>
                {key} {errors[key]}
              </li>
            );
          })
        }
      </ul>
    );
  } else {
    return null;
  }
}

export default ListErrors;
