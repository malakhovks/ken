const granimInstance = new Granim({
    element: '#canvas-basic',
    direction: 'left-right',
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                // ['#ff9966', '#ff5e62'],
                // ['#00F260', '#0575E6'],
                // ['#e1eec3', '#f05053']
                ['#ffe203', '#0037ff'],
                ['#00F260', '#0575E6'],
                ['#e1eec3', '#f05053']
            ]
        }
    }
});