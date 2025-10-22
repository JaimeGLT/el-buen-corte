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
}

const ListPageComponent = ({
  searcher,
  placeholder = "Buscar...",
  select,
  selectOpt,
}: ListPageComponentProps) => {
    return (
        <div className="border border-gray-300 w-full p-5 rounded-xl my-5">
            <nav className="flex gap-5">
                {searcher && (
                <div
                    className="w-full flex items-center gap-2 p-2 border border-gray-300 rounded-xl 
                            focus-within:border-[#ef4b67] transition-colors duration-200"
                >
                    <Search className="text-gray-600 size-4 text-sm" />
                    <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full text-sm placeholder:text-xs focus:outline-none"
                    />
                </div>
                )}

                {select && (
                <select className="w-55 text-xs rounded-xl border border-gray-300">
                    {selectOpt?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                    ))}
                </select>
                )}
            </nav>
        </div>
    );
};

export default ListPageComponent;
