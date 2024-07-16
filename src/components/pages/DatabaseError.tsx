interface DatabaseErrorProps {
  message: string;
}

/**
 * DatabaseError component.
 *
 * This component is used to display an error message when there is a database error.
 *
 * @param {Object} props - The component props.
 * @param {string} props.message - The error message to be displayed.
 * @returns {JSX.Element} The DatabaseError component.
 */
const DatabaseError = ({ message }: DatabaseErrorProps): JSX.Element => {
  return <div className="absolute bg-orange-600 text-white p-2 text-center text-sm w-full t-0 z-50">{message}</div>;
};

export default DatabaseError;
