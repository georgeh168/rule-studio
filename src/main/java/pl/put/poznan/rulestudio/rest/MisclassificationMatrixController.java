package pl.put.poznan.rulestudio.rest;

import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.MisclassificationMatrixType;
import pl.put.poznan.rulestudio.model.NamedResource;
import pl.put.poznan.rulestudio.service.MisclassificationMatrixService;

import java.util.UUID;

@CrossOrigin(exposedHeaders = {"Content-Disposition"})
@RequestMapping("/projects/{id}/misclassificationMatrix")
@RestController
public class MisclassificationMatrixController {

    private static final Logger logger = LoggerFactory.getLogger(MisclassificationMatrixController.class);

    private final MisclassificationMatrixService misclassificationMatrixService;

    @Autowired
    public MisclassificationMatrixController(MisclassificationMatrixService misclassificationMatrixService) {
        this.misclassificationMatrixService = misclassificationMatrixService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrdinalMisclassificationMatrix> getMisclassificationMatrix (
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfMatrix") MisclassificationMatrixType typeOfMatrix,
            @RequestParam(name = "numberOfFold", required = false) Integer numberOfFold) {
        logger.info("Getting misclassification matrix...");
        OrdinalMisclassificationMatrix result = misclassificationMatrixService.getMisclassificationMatrix(id, typeOfMatrix, numberOfFold);
        return ResponseEntity.ok(result);
    }

    @RequestMapping(value = "/download", method = RequestMethod.GET, produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> download (
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfMatrix") MisclassificationMatrixType typeOfMatrix,
            @RequestParam(name = "numberOfFold", required = false) Integer numberOfFold) {
        logger.info("Downloading misclassification matrix");
        NamedResource namedResource = misclassificationMatrixService.download(id, typeOfMatrix, numberOfFold);

        String filename = namedResource.getName();
        Resource resource = namedResource.getResource();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .body(resource);
    }
}
