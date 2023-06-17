import { ScrollAnchor } from '@marzahn-dev/react-scroll-anchor';

export function App() {
  return (
    <div>
      <a href="#section1">Section 1</a>
      <a href="#section2">Section 2</a>
      <a href="#section3">Section 3</a>

      <ScrollAnchor anchor="section1" offset={-80}>
        <div style={{ height: '100vh', background: 'lightcyan' }}>
          Section 1
        </div>
      </ScrollAnchor>

      <ScrollAnchor anchor="section2">
        <div style={{ height: '100vh', background: 'lightpink' }}>
          Section 2
        </div>
      </ScrollAnchor>
    </div>
  );
}

export default App;
