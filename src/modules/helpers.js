const helpers = {
    URLToBlob: url => {
        return new Promise(resolve => {
            fetch(url, {
                headers: new Headers({
                    'Origin': location.origin
                }),
                mode: 'cors'
            })
                .then(response => response.blob())
                .then(blob => {
                    resolve(blob);
                })
                .catch(e => console.error(e));
        });
    },

    download: (url, name) => {
        const a = document.createElement('a');
        a.setAttribute('download', name);
        a.setAttribute('href', url);
        a.click();
    }
};

export default helpers;