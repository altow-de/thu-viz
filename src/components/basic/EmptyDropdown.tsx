const EmptyDropdown = () => {
  return (
    <select
      className="mb-4 minimal text-danube-900 border-danube-400 border py-2 px-4 w-full rounded-lg font-light text-sm placeholder-gray-custom bg-white disabled:opacity-40 disabled:cursor-not-allowed outline-danube-600 appearance-none"
      defaultValue={-1}
      disabled={true}
    >
      <option className="text-danube-900" key={-1} value={-1}></option>
    </select>
  );
};
export default EmptyDropdown;
