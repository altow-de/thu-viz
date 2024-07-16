interface BackgroundProps {
  children: React.ReactNode;
}

/**
 * Background component.
 *
 * This component provides a background for the main content of the page, featuring a gradient background and a wave image at the bottom.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be displayed within the background.
 * @returns {JSX.Element} The Background component.
 */
const Background = ({ children }: BackgroundProps): JSX.Element => {
  return (
    <main className="min-h-screen w-full flex justify-center bg-gradient-to-b from-danube-200 to-danube-800 relative py-8 sm:py-16 text-danube-950 overflow-x-hidden">
      <div className="absolute bottom-0 w-full z-1">
        <img className="z-0" src="waves.svg" alt="Wave background" />
      </div>
      {children}
    </main>
  );
};

export default Background;
