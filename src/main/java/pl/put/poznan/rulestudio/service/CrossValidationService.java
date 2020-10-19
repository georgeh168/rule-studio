package pl.put.poznan.rulestudio.service;

import org.rulelearn.approximations.UnionsWithSingleLimitingDecision;
import org.rulelearn.data.Decision;
import org.rulelearn.data.Index2IdMapper;
import org.rulelearn.data.InformationTable;
import org.rulelearn.rules.*;
import org.rulelearn.sampling.CrossValidator;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;
import pl.put.poznan.rulestudio.enums.RuleType;
import pl.put.poznan.rulestudio.enums.UnionType;
import pl.put.poznan.rulestudio.exception.EmptyResponseException;
import pl.put.poznan.rulestudio.exception.NoDataException;
import pl.put.poznan.rulestudio.exception.WrongParameterException;
import pl.put.poznan.rulestudio.model.*;
import pl.put.poznan.rulestudio.model.response.*;
import pl.put.poznan.rulestudio.model.response.AttributeFieldsResponse.AttributeFieldsResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenClassifiedObjectWithAttributesResponse.ChosenClassifiedObjectWithAttributesResponseBuilder;
import pl.put.poznan.rulestudio.model.response.ChosenCrossValidationFoldResponse.ChosenCrossValidationFoldResponseBuilder;
import pl.put.poznan.rulestudio.model.response.DescriptiveAttributesResponse.DescriptiveAttributtesResponseBuilder;
import pl.put.poznan.rulestudio.model.response.MainCrossValidationResponse.MainCrossValidationResponseBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class CrossValidationService {

    private static final Logger logger = LoggerFactory.getLogger(CrossValidationService.class);

    @Autowired
    ProjectsContainer projectsContainer;

    public static CrossValidation getCrossValidationFromProject(Project project) {
        CrossValidation crossValidation = project.getCrossValidation();
        if(crossValidation == null) {
            EmptyResponseException ex = new EmptyResponseException("Cross-validation hasn't been calculated.");
            logger.error(ex.getMessage());
            throw ex;
        }

        return crossValidation;
    }

    private int[] extractIndices(InformationTable foldInformationTable, Index2IdMapper mainIndex2IdMapper) {
        int[] indices = new int[foldInformationTable.getNumberOfObjects()];
        Index2IdMapper foldIndex2IdMapper = foldInformationTable.getIndex2IdMapper();

        for(int i = 0; i < foldInformationTable.getNumberOfObjects(); i++) {
            indices[i] = mainIndex2IdMapper.getIndex( foldIndex2IdMapper.getId(i) );
        }

        return indices;
    }

    private void rearrangeIndicesOfCoveredObject(RuLeStudioRuleSet ruLeStudioRuleSet, int[] indicesOfTrainingObjects) {
        RuLeStudioRule[] ruLeStudioRules = ruLeStudioRuleSet.getRuLeStudioRules();
        for(int ruleIndex = 0; ruleIndex < ruLeStudioRules.length; ruleIndex++) {
            Integer[] indicesOfCoveredObjects = ruLeStudioRules[ruleIndex].getIndicesOfCoveredObjects();
            for(int listIndex = 0; listIndex < indicesOfCoveredObjects.length; listIndex++) {
                int oldIndex = indicesOfCoveredObjects[listIndex];
                int newIndex = indicesOfTrainingObjects[oldIndex];
                indicesOfCoveredObjects[listIndex] = newIndex;
            }
        }
    }

    private CrossValidation calculateCrossValidation(InformationTable informationTable, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed) {
        if(informationTable == null) {
            NoDataException ex = new NoDataException("There is no data in project. Couldn't calculate cross-validation.");
            logger.error(ex.getMessage());
            throw ex;
        }
        if(informationTable.getNumberOfObjects() == 0) {
            NoDataException ex = new NoDataException("There are no objects in project. Couldn't calculate cross-validation.");
            logger.error(ex.getMessage());
            throw ex;
        }

        if(numberOfFolds < 2) {
            WrongParameterException ex = new WrongParameterException(String.format("There must be at least 2 folds, %d is not enough. Couldn't calculate cross-validation.", numberOfFolds));
            logger.error(ex.getMessage());
            throw ex;
        }
        if(numberOfFolds > informationTable.getNumberOfObjects()) {
            WrongParameterException ex = new WrongParameterException(String.format("Number of folds shouldn't be greater than number of objects. %d folds is more than %d objects. Couldn't calculate cross-validation.", numberOfFolds, informationTable.getNumberOfObjects()));
            logger.error(ex.getMessage());
            throw ex;
        }

        CrossValidationSingleFold crossValidationSingleFolds[] = new CrossValidationSingleFold[numberOfFolds];
        Decision[] orderOfDecisions = informationTable.getOrderedUniqueFullyDeterminedDecisions();
        OrdinalMisclassificationMatrix[] foldOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix[numberOfFolds];

        Index2IdMapper mainIndex2IdMapper = informationTable.getIndex2IdMapper();
        int i;
        int[] indicesOfTrainingObjects, indicesOfValidationObjects;

        CrossValidator crossValidator = new CrossValidator(new Random());
        crossValidator.setSeed(seed);
        List<CrossValidator.CrossValidationFold<InformationTable>> folds = crossValidator.splitStratifiedIntoKFold(DataService.createInformationTableWithDecisionDistributions(informationTable), numberOfFolds);
        for(i = 0; i < folds.size(); i++) {
            logger.info("Creating fold: {}/{}", i+1, folds.size());

            InformationTable trainingTable = folds.get(i).getTrainingTable();
            InformationTable validationTable = folds.get(i).getValidationTable();

            UnionsWithSingleLimitingDecision unionsWithSingleLimitingDecision = UnionsService.calculateUnionsWithSingleLimitingDecision(trainingTable, typeOfUnions, consistencyThreshold);
            RuleSetWithCharacteristics ruleSetWithCharacteristics = RulesService.calculateRuleSetWithCharacteristics(unionsWithSingleLimitingDecision, typeOfRules);

            Classification classificationValidationTable = ClassificationService.calculateClassification(trainingTable, validationTable, typeOfClassifier, defaultClassificationResult, ruleSetWithCharacteristics, orderOfDecisions);
            classificationValidationTable.setCrossValidation(true);

            foldOrdinalMisclassificationMatrix[i] = classificationValidationTable.getOrdinalMisclassificationMatrix();

            indicesOfTrainingObjects = extractIndices(trainingTable, mainIndex2IdMapper);
            indicesOfValidationObjects = extractIndices(validationTable, mainIndex2IdMapper);

            RuLeStudioRuleSet ruLeStudioRuleSet = new RuLeStudioRuleSet(ruleSetWithCharacteristics);
            rearrangeIndicesOfCoveredObject(ruLeStudioRuleSet, indicesOfTrainingObjects);

            crossValidationSingleFolds[i] = new CrossValidationSingleFold(indicesOfTrainingObjects, indicesOfValidationObjects, ruLeStudioRuleSet, classificationValidationTable);

            //let garbage collector clean memory occupied by i-th fold
            folds.set(i, null);
        }

        OrdinalMisclassificationMatrix meanOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(orderOfDecisions, foldOrdinalMisclassificationMatrix);
        OrdinalMisclassificationMatrix sumOrdinalMisclassificationMatrix = new OrdinalMisclassificationMatrix(true, orderOfDecisions, foldOrdinalMisclassificationMatrix);

        DescriptiveAttributes descriptiveAttributes = new DescriptiveAttributes(informationTable);

        CrossValidation crossValidation = new CrossValidation(numberOfFolds, informationTable, crossValidationSingleFolds, meanOrdinalMisclassificationMatrix, sumOrdinalMisclassificationMatrix, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, seed, informationTable.getHash(), descriptiveAttributes);
        return crossValidation;
    }

    public MainCrossValidationResponse getCrossValidation(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final MainCrossValidationResponse mainCrossValidationResponse = MainCrossValidationResponseBuilder.newInstance().build(crossValidation);
        logger.debug("mainCrossValidationResponse:\t{}", mainCrossValidationResponse.toString());
        return mainCrossValidationResponse;
    }

    public MainCrossValidationResponse putCrossValidation(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed) {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);
        logger.info("Seed:\t{}", seed);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = project.getInformationTable();

        CrossValidation crossValidation = calculateCrossValidation(informationTable, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed);

        project.setCrossValidation(crossValidation);

        final MainCrossValidationResponse mainCrossValidationResponse = MainCrossValidationResponseBuilder.newInstance().build(crossValidation);
        logger.debug("mainCrossValidationResponse:\t{}", mainCrossValidationResponse.toString());
        return mainCrossValidationResponse;
    }

    public MainCrossValidationResponse postCrossValidation(UUID id, UnionType typeOfUnions, Double consistencyThreshold, RuleType typeOfRules, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult, Integer numberOfFolds, Long seed, String metadata, String data) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("TypeOfUnions:\t{}", typeOfUnions);
        logger.info("ConsistencyThreshold:\t{}", consistencyThreshold);
        logger.info("TypeOfRules:\t{}", typeOfRules);
        logger.info("TypeOfClassifier:\t{}", typeOfClassifier);
        logger.info("DefaultClassificationResult:\t{}", defaultClassificationResult);
        logger.info("NumberOfFolds:\t{}", numberOfFolds);
        logger.info("Metadata:\t{}", metadata);
        logger.info("Data size:\t{} B", data.length());
        logger.debug("Data:\t{}", data);
        logger.info("Seed:\t{}", seed);

        Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        InformationTable informationTable = ProjectService.createInformationTableFromString(metadata, data);
        project.setInformationTable(informationTable);

        CrossValidation crossValidation = calculateCrossValidation(informationTable, typeOfUnions, consistencyThreshold, typeOfRules, typeOfClassifier, defaultClassificationResult, numberOfFolds, seed);

        project.setCrossValidation(crossValidation);

        final MainCrossValidationResponse mainCrossValidationResponse = MainCrossValidationResponseBuilder.newInstance().build(crossValidation);
        logger.debug("mainCrossValidationResponse:\t{}", mainCrossValidationResponse.toString());
        return mainCrossValidationResponse;
    }

    public DescriptiveAttributesResponse getDescriptiveAttributes(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(crossValidation.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public DescriptiveAttributesResponse postDescriptiveAttributes(UUID id, String objectVisibleName) {
        logger.info("Id:\t{}", id);
        logger.info("ObjectVisibleName:\t{}", objectVisibleName);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        DescriptiveAttributes descriptiveAttributes = crossValidation.getDescriptiveAttributes();
        descriptiveAttributes.setCurrentAttribute(objectVisibleName);

        final DescriptiveAttributesResponse descriptiveAttributesResponse = DescriptiveAttributtesResponseBuilder.newInstance().build(crossValidation.getDescriptiveAttributes());
        logger.debug("descriptiveAttributesResponse:\t{}", descriptiveAttributesResponse.toString());
        return descriptiveAttributesResponse;
    }

    public AttributeFieldsResponse getObjectNames(UUID id) {
        logger.info("Id:\t{}", id);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final Integer descriptiveAttributeIndex = crossValidation.getDescriptiveAttributes().getCurrentAttributeInformationTableIndex();
        final AttributeFieldsResponse attributeFieldsResponse = AttributeFieldsResponseBuilder.newInstance().build(crossValidation.getInformationTable(), descriptiveAttributeIndex);
        logger.debug("attributeFieldsResponse:\t{}", attributeFieldsResponse.toString());
        return attributeFieldsResponse;
    }

    public ChosenCrossValidationFoldResponse getChosenCrossValidationFold(UUID id, Integer foldIndex) {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        final ChosenCrossValidationFoldResponse chosenCrossValidationFoldResponse = ChosenCrossValidationFoldResponseBuilder.newInstance().build(crossValidation, foldIndex);
        logger.debug("chosenCrossValidationFoldResponse:\t{}", chosenCrossValidationFoldResponse.toString());
        return chosenCrossValidationFoldResponse;
    }

    public ChosenClassifiedObjectAbstractResponse getChosenClassifiedObject(UUID id, Integer foldIndex, Integer objectIndex, Boolean isAttributes) throws IOException {
        logger.info("Id:\t{}", id);
        logger.info("FoldIndex:\t{}", foldIndex);
        logger.info("ClassifiedObjectIndex:\t{}", objectIndex);
        logger.info("IsAttributes:\t{}", isAttributes);

        final Project project = ProjectService.getProjectFromProjectsContainer(projectsContainer, id);

        final CrossValidation crossValidation = getCrossValidationFromProject(project);

        if((foldIndex < 0) || (foldIndex >= crossValidation.getNumberOfFolds())) {
            WrongParameterException ex = new WrongParameterException(String.format("Given fold's index \"%d\" is incorrect. You can choose fold from %d to %d", foldIndex, 0, crossValidation.getNumberOfFolds() - 1));
            logger.error(ex.getMessage());
            throw ex;
        }
        final CrossValidationSingleFold chosenFold = crossValidation.getCrossValidationSingleFolds()[foldIndex];

        ChosenClassifiedObjectAbstractResponse chosenClassifiedObjectAbstractResponse;
        if(isAttributes) {
            chosenClassifiedObjectAbstractResponse = ChosenClassifiedObjectWithAttributesResponseBuilder.newInstance().build(chosenFold.getClassificationOfValidationTable(), objectIndex);
        } else {
            chosenClassifiedObjectAbstractResponse = ChosenClassifiedObjectResponse.ChosenClassifiedObjectResponseBuilder.newInstance().build(chosenFold.getClassificationOfValidationTable(), objectIndex);
        }
        logger.debug("chosenClassifiedObjectAbstractResponse:\t{}", chosenClassifiedObjectAbstractResponse);
        return chosenClassifiedObjectAbstractResponse;
    }
}
