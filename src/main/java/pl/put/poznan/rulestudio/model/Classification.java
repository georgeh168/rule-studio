package pl.put.poznan.rulestudio.model;

import it.unimi.dsi.fastutil.ints.IntList;
import org.rulelearn.classification.ClassificationResult;
import org.rulelearn.data.Decision;
import org.rulelearn.data.InformationTable;
import org.rulelearn.validation.OrdinalMisclassificationMatrix;
import pl.put.poznan.rulestudio.enums.ClassifierType;
import pl.put.poznan.rulestudio.enums.DefaultClassificationResultType;

import java.util.Arrays;

public class Classification {
    private ClassificationResult[] classificationResults;
    private InformationTable informationTable;
    private Decision[] orderOfDecisions;
    private IntList[] indicesOfCoveringRules;
    private OrdinalMisclassificationMatrix ordinalMisclassificationMatrix;
    private ClassifierType typeOfClassifier;
    private DefaultClassificationResultType defaultClassificationResult;
    private boolean externalData;
    private String externalDataFileName;

    public Classification(ClassificationResult[] simpleClassificationResults, InformationTable informationTable) {
        this.classificationResults = simpleClassificationResults;
        this.informationTable = informationTable;
    }

    public Classification(ClassificationResult[] classificationResults, InformationTable informationTable, Decision[] orderOfDecisions, IntList[] indicesOfCoveringRules, OrdinalMisclassificationMatrix ordinalMisclassificationMatrix) {
        this.classificationResults = classificationResults;
        this.informationTable = informationTable;
        this.orderOfDecisions = orderOfDecisions;
        this.indicesOfCoveringRules = indicesOfCoveringRules;
        this.ordinalMisclassificationMatrix = ordinalMisclassificationMatrix;
    }

    public Classification(ClassificationResult[] classificationResults, InformationTable informationTable, Decision[] orderOfDecisions, IntList[] indicesOfCoveringRules, OrdinalMisclassificationMatrix ordinalMisclassificationMatrix, ClassifierType typeOfClassifier, DefaultClassificationResultType defaultClassificationResult) {
        this.classificationResults = classificationResults;
        this.informationTable = informationTable;
        this.orderOfDecisions = orderOfDecisions;
        this.indicesOfCoveringRules = indicesOfCoveringRules;
        this.ordinalMisclassificationMatrix = ordinalMisclassificationMatrix;
        this.typeOfClassifier = typeOfClassifier;
        this.defaultClassificationResult = defaultClassificationResult;
        this.externalData = false;
    }

    public ClassificationResult[] getClassificationResults() {
        return classificationResults;
    }

    public void setClassificationResults(ClassificationResult[] classificationResults) {
        this.classificationResults = classificationResults;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
    }

    public Decision[] getOrderOfDecisions() {
        return orderOfDecisions;
    }

    public void setOrderOfDecisions(Decision[] orderOfDecisions) {
        this.orderOfDecisions = orderOfDecisions;
    }

    public IntList[] getIndicesOfCoveringRules() {
        return indicesOfCoveringRules;
    }

    public void setIndicesOfCoveringRules(IntList[] indicesOfCoveringRules) {
        this.indicesOfCoveringRules = indicesOfCoveringRules;
    }

    public OrdinalMisclassificationMatrix getOrdinalMisclassificationMatrix() {
        return ordinalMisclassificationMatrix;
    }

    public void setOrdinalMisclassificationMatrix(OrdinalMisclassificationMatrix ordinalMisclassificationMatrix) {
        this.ordinalMisclassificationMatrix = ordinalMisclassificationMatrix;
    }

    public ClassifierType getTypeOfClassifier() {
        return typeOfClassifier;
    }

    public void setTypeOfClassifier(ClassifierType typeOfClassifier) {
        this.typeOfClassifier = typeOfClassifier;
    }

    public DefaultClassificationResultType getDefaultClassificationResult() {
        return defaultClassificationResult;
    }

    public void setDefaultClassificationResult(DefaultClassificationResultType defaultClassificationResult) {
        this.defaultClassificationResult = defaultClassificationResult;
    }

    public boolean isExternalData() {
        return externalData;
    }

    public void setExternalData(boolean externalData) {
        this.externalData = externalData;
    }

    public String getExternalDataFileName() {
        return externalDataFileName;
    }

    public void setExternalDataFileName(String externalDataFileName) {
        this.externalDataFileName = externalDataFileName;
    }

    @Override
    public String toString() {
        return "Classification{" +
                "classificationResults=" + Arrays.toString(classificationResults) +
                ", informationTable=" + informationTable +
                ", orderOfDecisions=" + Arrays.toString(orderOfDecisions) +
                ", indicesOfCoveringRules=" + Arrays.toString(indicesOfCoveringRules) +
                ", ordinalMisclassificationMatrix=" + ordinalMisclassificationMatrix +
                ", typeOfClassifier=" + typeOfClassifier +
                ", defaultClassificationResult=" + defaultClassificationResult +
                ", externalData=" + externalData +
                ", externalDataFileName='" + externalDataFileName + '\'' +
                '}';
    }
}
