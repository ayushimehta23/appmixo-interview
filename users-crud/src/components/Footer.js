export default function Footer() {
    return (
      <footer className="bg-dark text-white py-3 mt-5">
        <div className="container text-center">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} User Manager. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  