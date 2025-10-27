import { Search } from "lucide-react";

interface SelectOpt {
  value: string;
  name: string;
}

interface ListPageComponentProps {
  searcher: boolean;
  select: boolean;
  placeholder?: string;
  selectOpt?: SelectOpt[];
  children?: any;
}

const ListPageComponent = ({
  searcher,
  placeholder = "Buscar...",
  select,
  selectOpt,
  children
}: ListPageComponentProps) => {
    return (
        <div className="border border-gray-300 w-full p-5 rounded-xl my-5 gap-5 flex flex-col">
            <nav className="flex gap-5">
                {searcher && (
                <div
                    className="w-full flex items-center gap-2 p-2 border border-gray-300 rounded-xl 
                            focus-within:border-primary-bg transition-colors duration-200 text-[#68606a]"
                >
                    <Search className="text-gray-600 size-4 text-sm" />
                    <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full text-sm placeholder:text-sm focus:outline-none"
                    />
                </div>
                )}

                {select && (
                <select className="w-55 text-sm rounded-xl border border-gray-300 text-[#68606a]">
                    {selectOpt?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                    ))}
                </select>
                )}
            </nav>
            <>
                { children }
            </>
        </div>
    );
};

export default ListPageComponent;
