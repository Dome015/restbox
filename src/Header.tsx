import "./Header.css";

interface HeaderProps {
  collectionName: string;
}

export default function Header({ collectionName }: HeaderProps) {
  return <div className="header-container">
    {collectionName}
  </div>
}