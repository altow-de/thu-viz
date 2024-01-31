interface DatabaseErrorProps {
  message: string;
}

const DatabaseError = ({ message }: DatabaseErrorProps) => {
  return <div className="bg-orange-600 text-white p-2 text-center text-sm">{message}</div>;
};

export default DatabaseError;
