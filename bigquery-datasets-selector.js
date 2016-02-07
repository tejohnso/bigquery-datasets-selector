(function() {
  var thisImportDoc = document.currentScript.ownerDocument,
  selectElement = thisImportDoc.querySelector("select"),
  proto = Object.create(HTMLElement.prototype);
  proto.createdCallback = function() {
    this.appendChild(selectElement);
  };

  document.registerElement("bigquery-datasets-selector", {prototype: proto});

  document.querySelector("bigquery-projects-selector").addEventListener("change", populateDatasets);

  function populateDatasets(e) {
    var projectId = document.querySelector("bigquery-projects-selector select").value;
    reset();
    gapi.client.bigquery.datasets.list({"projectId": projectId})
    .then((resp)=>{
      resp.result.datasets.forEach((val)=>{
        var option = document.createElement("option");
        option.text = val.datasetReference.datasetId;
        selectElement.add(option);
      });

      selectElement.options[0].textContent = "Choose dataset";
    });
  }

  function reset() {
    if (!selectElement) {return;}
    for (var i = 1, j = selectElement.children.length; i < j; i += 1) {
      selectElement.removeChild(selectElement.children[1]);
    }
    selectElement.children[0].innerHTML = "Select a dataset";
  }
}());
