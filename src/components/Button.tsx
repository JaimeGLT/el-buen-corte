interface ButtonProps {
    content: string;
}

const ButtonComponent = ({ content }: ButtonProps) => {
    return (
        <div>
            <button className='bg-[#ef4b67] text-white rounded-xl py-2 px-2'>{content}</button>
        </div>
    )
}

export default ButtonComponent