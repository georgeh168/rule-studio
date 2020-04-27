package pl.put.poznan.rulework.model;

import org.rulelearn.data.Attribute;
import org.rulelearn.data.InformationTable;
import pl.put.poznan.rulework.exception.NoDataException;

import java.util.ArrayList;
import java.util.UUID;

public class Project {
    private UUID id;
    private String name;
    private InformationTable informationTable;
    private DominanceCones dominanceCones;
    private UnionsWithHttpParameters unions;
    private RulesWithHttpParameters rules;
    private Classification classification;
    private CrossValidation crossValidation;

    private boolean currentDominanceCones;
    private boolean currentUnionsWithSingleLimitingDecision;
    private boolean currentRules;

    public Project(String name) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.informationTable = null;
        this.currentDominanceCones = false;
        this.currentUnionsWithSingleLimitingDecision = false;
        this.currentRules = false;
    }

    public Project(String name, InformationTable informationTable) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.informationTable = informationTable;
        this.currentDominanceCones = false;
        this.currentUnionsWithSingleLimitingDecision = false;
        this.currentRules = false;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public InformationTable getInformationTable() {
        return informationTable;
    }

    public void setInformationTable(InformationTable informationTable) {
        this.informationTable = informationTable;
        this.setCurrentDominanceCones(false);
        this.setCurrentUnionsWithSingleLimitingDecision(false);
        this.setCurrentRules(false);
    }

    public DominanceCones getDominanceCones() {
        return dominanceCones;
    }

    public void setDominanceCones(DominanceCones dominanceCones) {
        this.dominanceCones = dominanceCones;
    }

    public UnionsWithHttpParameters getUnions() {
        return unions;
    }

    public void setUnions(UnionsWithHttpParameters unions) {
        this.unions = unions;
    }

    public boolean isCurrentDominanceCones() {
        return currentDominanceCones;
    }

    public void setCurrentDominanceCones(boolean currentDominanceCones) {
        this.currentDominanceCones = currentDominanceCones;
    }

    public boolean isCurrentUnionsWithSingleLimitingDecision() {
        return currentUnionsWithSingleLimitingDecision;
    }

    public void setCurrentUnionsWithSingleLimitingDecision(boolean currentUnionsWithSingleLimitingDecision) {
        this.currentUnionsWithSingleLimitingDecision = currentUnionsWithSingleLimitingDecision;
    }

    public boolean isCurrentRules() {
        return currentRules;
    }

    public void setCurrentRules(boolean currentRules) {
        this.currentRules = currentRules;
    }

    public RulesWithHttpParameters getRules() {
        return rules;
    }

    public void setRules(RulesWithHttpParameters rules) {
        this.rules = rules;
    }

    public Classification getClassification() {
        return classification;
    }

    public void setClassification(Classification classification) {
        this.classification = classification;
    }

    public CrossValidation getCrossValidation() {
        return crossValidation;
    }

    public void setCrossValidation(CrossValidation crossValidation) {
        this.crossValidation = crossValidation;
    }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", informationTable=" + informationTable +
                ", dominanceCones=" + dominanceCones +
                ", unions=" + unions +
                ", rules=" + rules +
                ", classification=" + classification +
                ", crossValidation=" + crossValidation +
                ", currentDominanceCones=" + currentDominanceCones +
                ", currentUnionsWithSingleLimitingDecision=" + currentUnionsWithSingleLimitingDecision +
                '}';
    }
}