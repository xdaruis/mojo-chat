export default function Footer() {
  return (
    <footer className="fixed bottom-4 left-0 right-0">
      <div className="mx-auto w-full text-center text-xs text-gray-500">
        Made with{' '}
        <span role="img" aria-label="love">
          ❤️
        </span>{' '}
        from xdaruis ·{' '}
        <a
          href="https://github.com/xdaruis/mojo-chat"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
