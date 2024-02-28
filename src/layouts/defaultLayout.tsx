
type DefaultLayoutProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children, className }) => {

  return (
    <div className={className}>
      <h1>Default Layout</h1>
      {children}
    </div>
  )
}

export default DefaultLayout;