interface CheckboxProps {
  checked: boolean;
  label: string;
}

const Checkbox = ({ checked, label }: CheckboxProps) => {
  return (
    <div className="flex items-center">
      <input
        id="link-checkbox"
        type="checkbox"
        value=""
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label htmlFor="link-checkbox" className="ms-2 text-sm font-medium text-danube-900 dark:text-gray-300">
        {label}
      </label>
    </div>
  );
};
export default Checkbox;
