let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        //xhr.send(obj.body);
        xhr.send();
    });
};

request({url: "http://devpmoclick/_vti_bin/ConnectedItemsAPI/api/ConnectItems/GetDocLinks/?siteUrl=http://devpmoclick/sites/Ministers/SeniorCitizensCEO&listId=01AA051D-31D5-4335-B80B-EC444E8B0DD2&itemId=5&parentDocId=a88ccae9-9875-40c8-adfb-c43c071fafdc",method : "GET", headers : { 'accept': 'application/json;odata=verbose','Access-Control-Allow-Origin': '*'}})
    .then(data => {
        let employees = JSON.parse(data);
        let html = "";
        employees.forEach(employee => {
            html += `
                <div>
                    <img src='${employee.picture}'/>
                    <div>
                        ${employee.firstName} ${employee.lastName}
                        <p>${employee.phone}</p>
                    </div>
                </div>`;
        });
        document.getElementById("list").innerHTML = html;
    })
    .catch(error => {
        console.log(error);
    });
