const Logo = ({ container, image }: { container: string; image?: string }) => {
  return (
    <div className={container}>
      <img src='/logo.png' alt='logo' className={image} />
    </div>
  )
}

export default Logo
