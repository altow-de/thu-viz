interface DatabaseErrorProps {
  message: string;
}

const DatabaseError = ({ message }: DatabaseErrorProps) => {
  return <div className="absolute bg-orange-600 text-white p-2 text-center text-sm w-full t-0 z-50">{message}</div>;
};

export default DatabaseError;
