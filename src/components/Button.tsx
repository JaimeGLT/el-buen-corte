interface ButtonProps {
    content: string;
    modalSetState?: (estado: boolean) => void;
    classNameButton?: string;
    modalState?: boolean;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

const ButtonComponent = ({ content, modalSetState, classNameButton, modalState, type = "button", onClick }: ButtonProps) => {
    const handleClick = () => {
        if (type === "button" && modalSetState && modalState !== undefined) {
            modalSetState(!modalState);
        }
    };
    return (
        <div>
            <button 
                type={type}
                className={`bg-primary-bg text-white rounded-xl py-2 px-2 cursor-pointer ${classNameButton}`}
                onClick={onClick ? onClick : handleClick}
            >{content}</button>
        </div>
    )
}

export default ButtonComponent