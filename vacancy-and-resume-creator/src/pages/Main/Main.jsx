const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

function Main() {

    const borderColor = 'rgba(0, 0, 0, 0.1)';

    const canvasHeight = 2000;
    const canvasWidth = 2000;

    const commonDivisor = gcd(canvasWidth, canvasHeight);

    const minStep = 10;
    const maxStep = 50;
    const scalar = 0.01;

    const gridSize = Math.min(Math.max(commonDivisor * scalar, minStep), maxStep);

    const minCanvasBorderSize = 1;
    const maxCanvasBorderSize = 4;

    const canvasBorderSize = Math.min(Math.max(gridSize / 10, minCanvasBorderSize), maxCanvasBorderSize);


    return (
        <div style={{
            boxSizing: 'border-box',
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gridTemplateRows: 'auto 1fr auto',
            gridTemplateAreas: `
            "left top right"
            "left center right"
            "left bottom right"
          `,
            width: '100%',
            height: '100%',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            background: '#F5F5F5',
            borderRadius: '2px',
            overflow: 'hidden'
        }}>
            {/* Main */}
            <div style={{
                gridArea: 'center',
                background: '#FFFFFF',
                overflow: 'auto',

            }}>
                {/* Canvas*/}
                <div style={{
                    width: `${canvasHeight}px`,
                    height: `${canvasWidth}px`,
                    backgroundColor: '#F5F5F5',
                    backgroundImage: `
                    linear-gradient(to right, #bbbbbb62 ${canvasBorderSize}px, transparent 1px),
                    linear-gradient(to bottom, #bbbbbb62 ${canvasBorderSize}px, transparent 1px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`
                }}></div>
            </div>

            {/* LeftHeader */}
            <div style={{
                gridArea: 'left',
                width: '200px',
                borderRight: `1px solid ${borderColor}`,
                boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
                zIndex: 2,
                background: '#F5F5F5',
                border: '1px solid #ccc',
            }}></div>

            {/* RightHeader */}
            <div style={{
                gridArea: 'right',
                background: '#F5F5F5',
                border: '1px solid #ccc',

                width: '200px',
                borderLeft: `1px solid ${borderColor}`,
                boxShadow: '-2px 0 5px rgba(0,0,0,0.05)',
                zIndex: 2,
            }}></div>

            {/* UpperHeader */}
            {/* <div style={{
                gridArea: 'top',
                background: '#555',
            }}></div> */}

            {/* BottomHeader */}
            {/* <div style={{
                gridArea: 'bottom',
                background: '#555',
            }}></div> */}
        </div>
    )
}

export default Main