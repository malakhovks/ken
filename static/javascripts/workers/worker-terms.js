function forUploadResultListClickAndEnterPressEvents() {

    if ($("#uploadResultList option:selected").text() != "") {
        //clear textArea #text-content
        $textContent.text('');

        objForTree.text = $("#uploadResultList option:selected").text();
        objForTree.osnova = JSON.parse($("#uploadResultList option:selected").val()).osnova;
        objForTree.nodes.length = 0;

        var valOfSelectedElementInUploadResultList = termsWithIndexDict[$("#uploadResultList option:selected").text()];

        // inserting sentences with selected terms in #text-content
        if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos)) {
            let sentIndex = [];
            let sentsForMark = [];
            for (let elementForUploadResultListDbClickAndEnterPress of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) {
                if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))))) {
                    $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))] + '</p><br>');
                    sentsForMark.push(alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))]);
                    sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))));
                }
            }
            mark(sentsForMark);
        }

        if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos) == false) {

            $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.indexOf("/"))] + '<p><br>');

            mark(alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].sentpos.indexOf("/"))]);
        }

        if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown') || alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup')) {
            // inserting terms in tree #term-tree
            if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown')) {

                // add child nodes to template structure for bootstrap-treeview
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown)) {
                    for (let elementForTermTree of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) {
                        objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname, osnova: alltermsJSON.termsintext.exporterms.term[elementForTermTree].osn });
                    }
                }
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown) == false) {
                    objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown].tname, osnova: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].reldown].osn });
                }
            }

            if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup')) {

                // add child nodes to template structure for bootstrap-treeview
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup)) {
                    for (let elementForTermTree of alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) {
                        objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[elementForTermTree].tname, osnova: alltermsJSON.termsintext.exporterms.term[elementForTermTree].osn });
                    }
                }
                if (Array.isArray(alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup) == false) {
                    objForTree.nodes.push({ text: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup].tname, osnova: alltermsJSON.termsintext.exporterms.term[alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].relup].osn });
                }
            }

            treeData.length = 0; //clear treeData array

            treeData.push(objForTree); //add structure to array

            $termTree.treeview({
                data: treeData,
                onNodeSelected: function (event, node) {
                    // inserting sentences with selected terms in #text-content
                    //clear #text-content
                    $textContent.text('');
                    let selectedTermInTermTree = termsWithIndexDict[node.text];
                    if (Array.isArray(alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) == false) {

                        $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/"))] + '<p><br>');

                        mark(alltermsJSON.termsintext.sentences.sent[alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.substring(0, alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos.indexOf("/"))]);
                    }
                    if (Array.isArray(alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos)) {
                        let sentIndex = [];
                        let sentsForMark = [];
                        for (let elementForUploadResultListDbClickAndEnterPress of alltermsJSON.termsintext.exporterms.term[selectedTermInTermTree].sentpos) {
                            if (!sentIndex.includes(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))))) {
                                $textContent.append('<p>' + alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))] + '</p><br>');
                                sentsForMark.push(alltermsJSON.termsintext.sentences.sent[elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))]);
                                sentIndex.push(parseInt(elementForUploadResultListDbClickAndEnterPress.substring(0, elementForUploadResultListDbClickAndEnterPress.indexOf("/"))));
                            }
                        }
                        mark(sentsForMark);
                    }
                    // markTerms(node.text);
                    markTerms(node.osnova);
                    copyTermTreeToTable(node.text);
                }
            }); // add array data to bootstrap-treeview and view it on page
        }

        if (alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('relup') == false && alltermsJSON.termsintext.exporterms.term[valOfSelectedElementInUploadResultList].hasOwnProperty('reldown') == false) {
            $termTree.treeview({});
        }

        // markTerms($("#uploadResultList option:selected").text().replace(/\s?([-])\s?/g, '-'));
        // markTerms($("#uploadResultList option:selected").text());
        markTerms(JSON.parse($("#uploadResultList option:selected").val()).osnova.join(" "));
    }

}