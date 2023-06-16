import { ScrollAnchor } from '@marzahn-dev/react-scroll-anchor';

export function App() {
  return (
    <div>
      <ScrollAnchor anchor="section1">
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
