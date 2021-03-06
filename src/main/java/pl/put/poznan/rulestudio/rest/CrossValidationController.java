package pl.put.poznan.rulestudio.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.model.CrossValidation;
import pl.put.poznan.rulestudio.service.CrossValidationService;

import java.io.IOException;
import java.util.UUID;

@CrossOrigin
@RequestMapping("projects/{id}/crossValidation")
@RestController
public class CrossValidationController {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationController.class);

    private final CrossValidationService crossValidationService;

    @Autowired
    public CrossValidationController(CrossValidationService crossValidationService) {
        this.crossValidationService = crossValidationService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CrossValidation> getCrossValidation(
            @PathVariable("id") UUID id) throws IOException {
        logger.info("Getting cross validation...");
        CrossValidation result = crossValidationService.getCrossValidation(id);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CrossValidation> putCrossValidation(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules,
            @RequestParam(name = "typeOfClassifier") ClassifierType typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") DefaultClassificationResultType defaultClassificationResult,
            @RequestParam(name = "numberOfFolds") Integer numberOfFolds,
            @RequestParam(name = "seed", defaultValue = "0") Long seed) {
        logger.info("Putting cross validation...");

        CrossValidation result = crossValidationService.putCrossValidation(id, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed);

        return ResponseEntity.ok(result);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CrossValidation> postCrossValidation(
            @PathVariable("id") UUID id,
            @RequestParam(name = "typeOfUnions") UnionType typeOfUnions,
            @RequestParam(name = "consistencyThreshold") Double consistencyThreshold,
            @RequestParam(name = "typeOfRules") RuleType typeOfRules,
            @RequestParam(name = "typeOfClassifier") ClassifierType typeOfClassifier,
            @RequestParam(name = "defaultClassificationResult") DefaultClassificationResultType defaultClassificationResult,
            @RequestParam(name = "numberOfFolds") Integer numberOfFolds,
            @RequestParam(name = "seed", defaultValue = "0") Long seed,
            @RequestParam(name = "metadata") String metadata,
            @RequestParam(name = "data") String data) throws IOException {
        logger.info("Posting cross validation...");

        CrossValidation result = crossValidationService.postCrossValidation(id, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed, metadata, data);

        return ResponseEntity.ok(result);
    }
}
