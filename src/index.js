import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

import dotenv from "dotenv";
dotenv.config();

const typeDefs = `#graphql

#######################################
#
# REACTION -> EC-NUMBER
# GO-TERM -> BIOLOGICAL PROCESS - MOLECULAR FUNCTION - CELLULAR COMPONENT
#
#######################################

type BiologicalProcess {
  id: ID
  name: String
  anc2vec_embedding: [Float]
  biologicalProcessIsABiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "biological_process_is_a_biological_process"
      direction: OUT
      properties: "Biological_process_is_a_biological_process"
    )
  biologicalProcessNegativelyRegulatesBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "biological_process_negatively_regulates_biological_process"
      direction: OUT
      properties: "Biological_process_negatively_regulates_biological_process"
    )
  biologicalProcessNegativelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "biological_process_negatively_regulates_molecular_function"
      direction: OUT
      properties: "Biological_process_negatively_regulates_molecular_function"
    )
  biologicalProcessPartOfBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "biological_process_part_of_biological_process"
      direction: OUT
      properties: "Biological_process_part_of_biological_process"
    )
  biologicalProcessPositivelyRegulatesBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "biological_process_positively_regulates_biological_process"
      direction: OUT
      properties: "Biological_process_positively_regulates_biological_process"
    )
  biologicalProcessPositivelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "biological_process_positively_regulates_molecular_function"
      direction: OUT
      properties: "Biological_process_positively_regulates_molecular_function"
    )
  proteinDomainInvolvedInBiologicalProcessReverse: [ProteinDomain!]!
    @relationship(
      type: "protein_domain_involved_in_biological_process"
      direction: IN
      properties: "Protein_domain_involved_in_biological_process"
    )
  proteinInvolvedInBiologicalProcessReverse: [Protein!]!
    @relationship(
      type: "protein_involved_in_biological_process"
      direction: IN
      properties: "Protein_involved_in_biological_process"
    )
}

type CellularComponent {
  id: ID
  name: String
  anc2vec_embedding: [Float]
  cellularComponentIsACellularComponent: [CellularComponent!]!
    @relationship(
      type: "cellular_component_is_a_cellular_component"
      direction: OUT
      properties: "Cellular_component_is_a_cellular_component"
    )
  cellularComponentPartOfCellularComponent: [CellularComponent!]!
    @relationship(
      type: "cellular_component_part_of_cellular_component"
      direction: OUT
      properties: "Cellular_component_part_of_cellular_component"
    )
  proteinDomainLocatedInCellularComponentReverse: [ProteinDomain!]!
    @relationship(
      type: "protein_domain_located_in_cellular_component"
      direction: IN
      properties: "Protein_domain_located_in_cellular_component"
    )
  proteinIsActiveInCellularComponentReverse: [Protein!]!
    @relationship(
      type: "protein_is_active_in_cellular_component"
      direction: IN
      properties: "Protein_is_active_in_cellular_component"
    )
  proteinLocatedInCellularComponentReverse: [Protein!]!
    @relationship(
      type: "protein_located_in_cellular_component"
      direction: IN
      properties: "Protein_located_in_cellular_component"
    )
  proteinPartOfCellularComponentReverse: [Protein!]!
    @relationship(
      type: "protein_part_of_cellular_component"
      direction: IN
      properties: "Protein_part_of_cellular_component"
    )
}

type Compound {
  id: ID
  alogp: Float
  full_mwt: Float
  heavy_atoms: Int
  inchi: String
  inchikey: String
  qed_score: Float
  selformer_embedding: [Float]
  smiles: String
  species: String
  type: String
  compoundTargetsProtein: [Protein!]!
    @relationship(
      type: "compound_targets_protein"
      direction: OUT
      properties: "Compound_targets_protein"
    )
}

type Disease {
  id: ID
  name: String
  doc2vec_embedding: [Float]
  doid: String
  efo: String
  hp: String
  icd10cm: String
  icd9: String
  meddra: String
  mesh: String
  ncit: String
  omim: String
  orphanet: String
  synonyms: [String]
  umls: String
  diseaseIsADisease: [Disease!]!
    @relationship(
      type: "disease_is_a_disease"
      direction: OUT
      properties: "Disease_is_a_disease"
    )
  diseaseIsAssociatedWithDisease: [Disease!]!
    @relationship(
      type: "disease_is_associated_with_disease"
      direction: OUT
      properties: "Disease_is_associated_with_disease"
    )
  diseaseIsComorbidWithDisease: [Disease!]!
    @relationship(
      type: "disease_is_comorbid_with_disease"
      direction: OUT
      properties: "Disease_is_comorbid_with_disease"
    )
  diseaseIsTreatedByDrug: [Drug!]!
    @relationship(
      type: "disease_is_treated_by_drug"
      direction: OUT
      properties: "Disease_is_treated_by_drug"
    )
  diseaseModulatesPathway: [Pathway!]!
    @relationship(
      type: "disease_modulates_pathway"
      direction: OUT
      properties: "Disease_modulates_pathway"
    )
  geneIsRelatedToDiseaseReverse: [Gene!]!
    @relationship(
      type: "gene_is_related_to_disease"
      direction: IN
      properties: "Gene_is_related_to_disease"
    )
  # organismCausesDiseaseReverse: [OrganismTaxon!]! @relationship(type: "organism_causes_disease", direction: IN, properties: "organism_causes_disease")
  phenotypeIsAssociatedWithDiseaseReverse: [Phenotype!]!
    @relationship(
      type: "phenotype_is_associated_with_disease"
      direction: IN
      properties: "Phenotype_is_associated_with_disease"
    )
}

type Drug {
  id: ID
  name: String
  atc_codes: [String]
  bindingdb: String
  cas_number: String
  chebi: String
  chembl: String
  clinicaltrials: String
  drugbank_id: String
  drugcentral: String
  general_references: [String]
  groups: [String]
  inchi: String
  inchikey: String
  kegg_drug: String
  pdb: String
  pharmgkb: String
  pubchem: String
  rxcui: String
  selformer_embedding: [Float]
  smiles: String
  zinc: String
  diseaseIsTreatedByDrugReverse: [Disease!]!
    @relationship(
      type: "disease_is_treated_by_drug"
      direction: IN
      properties: "Disease_is_treated_by_drug"
    )
  drugDownregulatesGene: [Gene!]!
    @relationship(
      type: "drug_downregulates_gene"
      direction: OUT
      properties: "Drug_downregulates_gene"
    )
  drugHasSideEffect: [SideEffect!]!
    @relationship(
      type: "drug_has_side_effect"
      direction: OUT
      properties: "Drug_has_side_effect"
    )
  drugHasTargetInPathway: [Pathway!]!
    @relationship(
      type: "drug_has_target_in_pathway"
      direction: OUT
      properties: "Drug_has_target_in_pathway"
    )
  drugUpregulatesGene: [Gene!]!
    @relationship(
      type: "drug_upregulates_gene"
      direction: OUT
      properties: "Drug_upregulates_gene"
    )
  drugInteractsWithDrug: [Drug!]!
    @relationship(
      type: "drug_interacts_with_drug"
      direction: OUT
      properties: "Drug_interacts_with_drug"
    )
  drugTargetsProtein: [Protein!]!
    @relationship(
      type: "drug_targets_protein"
      direction: OUT
      properties: "Drug_targets_protein"
    )
}

type EcNumber {
  id: ID
  name: String
  rxnfp_embedding: [Float]
  ecNumberIsAEcNumber: [EcNumber!]!
    @relationship(
      type: "ec_number_is_a_ec_number"
      direction: OUT
      properties: "Ec_number_is_a_ec_number"
    )
  proteinCatalyzesEcNumberReverse: [Protein!]!
    @relationship(
      type: "protein_catalyzes_ec_number"
      direction: IN
      properties: "Protein_catalyzes_ec_number"
    )
}

type Gene {
  id: ID
  ensembl_gene_ids: [String]
  ensembl_transcript_ids: [String]
  gene_names: [String]
  gene_symbol: String
  kegg_ids: [String]
  nt_embedding: [Float]
  drugDownregulatesGeneReverse: [Drug!]!
    @relationship(
      type: "drug_downregulates_gene"
      direction: IN
      properties: "Drug_downregulates_gene"
    )
  drugUpregulatesGeneReverse: [Drug!]!
    @relationship(
      type: "drug_upregulates_gene"
      direction: IN
      properties: "Drug_upregulates_gene"
    )
  geneEncodesProtein: [Protein!]!
    @relationship(
      type: "Gene_encodes_protein"
      direction: OUT
      properties: "Gene_encodes_protein"
    )
  geneIsOrthologousWithGene: [Gene!]!
    @relationship(
      type: "gene_is_orthologous_with_gene"
      direction: OUT
      properties: "Gene_is_orthologous_with_gene"
    )
  geneIsRelatedToDisease: [Disease!]!
    @relationship(
      type: "gene_is_related_to_disease"
      direction: OUT
      properties: "Gene_is_related_to_disease"
    )
  geneRegulatesGene: [Gene!]!
    @relationship(
      type: "gene_regulates_gene"
      direction: OUT
      properties: "Gene_regulates_gene"
    )
}

type GOTerm {
  id: ID
  name: String
  anc2vec_embedding: [Float]
}

type MolecularFunction {
  id: ID
  name: String
  anc2vec_embedding: [Float]
  biologicalProcessNegativelyRegulatesMolecularFunctionReverse: [BiologicalProcess!]!
    @relationship(
      type: "biological_process_negatively_regulates_molecular_function"
      direction: IN
      properties: "Biological_process_negatively_regulates_molecular_function"
    )
  biologicalProcessPositivelyRegulatesMolecularFunctionReverse: [BiologicalProcess!]!
    @relationship(
      type: "biological_process_positively_regulates_molecular_function"
      direction: IN
      properties: "Biological_process_positively_regulates_molecular_function"
    )
  molecularFunctionIsAMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "molecular_function_is_a_molecular_function"
      direction: OUT
      properties: "Molecular_function_is_a_molecular_function"
    )
  molecularFunctionNegativelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "molecular_function_negatively_regulates_molecular_function"
      direction: OUT
      properties: "Molecular_function_negatively_regulates_molecular_function"
    )
  molecularFunctionPartOfMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "molecular_function_part_of_molecular_function"
      direction: OUT
      properties: "Molecular_function_part_of_molecular_function"
    )
  molecularFunctionPositivelyRegulatesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "molecular_function_positively_regulates_molecular_function"
      direction: OUT
      properties: "Molecular_function_positively_regulates_molecular_function"
    )
  proteinContributesToMolecularFunctionReverse: [Protein!]!
    @relationship(
      type: "protein_contributes_to_molecular_function"
      direction: IN
      properties: "Protein_contributes_to_molecular_function"
    )
  proteinDomainEnablesMolecularFunctionReverse: [ProteinDomain!]!
    @relationship(
      type: "protein_domain_enables_molecular_function"
      direction: IN
      properties: "Protein_domain_enables_molecular_function"
    )
  proteinEnablesMolecularFunctionReverse: [Protein!]!
    @relationship(
      type: "protein_enables_molecular_function"
      direction: IN
      properties: "Protein_enables_molecular_function"
    )
}

type OrganismTaxon {
  id: ID
  organism_name: String
  ## organismCausesDisease: [Disease!]! @relationship(type: "organism_causes_disease", direction: OUT, properties: "organism_causes_disease")
  proteinBelongsToOrganismReverse: [Protein!]!
    @relationship(
      type: "Protein_belongs_to_organism"
      direction: IN
      properties: "Protein_belongs_to_organism"
    )
}

type Pathway {
  id: ID
  biokeen_embedding: [Float]
  name: String
  organism: String
  diseaseModulatesPathwayReverse: [Disease!]!
    @relationship(
      type: "disease_modulates_pathway"
      direction: IN
      properties: "Disease_modulates_pathway"
    )
  drugHasTargetInPathwayReverse: [Drug!]!
    @relationship(
      type: "drug_has_target_in_pathway"
      direction: IN
      properties: "Drug_has_target_in_pathway"
    )
  pathwayIsEquivalentToPathway: [Pathway!]!
    @relationship(
      type: "pathway_is_equivalent_to_pathway"
      direction: OUT
      properties: "Pathway_is_equivalent_to_pathway"
    )
  pathwayIsPartOfPathway: [Pathway!]!
    @relationship(
      type: "pathway_is_part_of_pathway"
      direction: OUT
      properties: "Pathway_is_part_of_pathway"
    )
  pathwayIsOrthologToPathway: [Pathway!]!
    @relationship(
      type: "pathway_is_ortholog_to_pathway"
      direction: OUT
      properties: "Pathway_is_ortholog_to_pathway"
    )

  pathwayParticipatesPathway: [Pathway!]!
    @relationship(
      type: "pathway_participates_pathway"
      direction: OUT
      properties: "Pathway_participates_pathway"
    )
  proteinTakePartInPathwayReverse: [Protein!]!
    @relationship(
      type: "protein_take_part_in_pathway"
      direction: IN
      properties: "Protein_take_part_in_pathway"
    )
  ## EXTRA RELATION
}

type Phenotype {
  id: ID
  cada_embedding: [Float]
  name: String
  synonyms: [String]
  phenotypeIsAPhenotype: [Phenotype!]!
    @relationship(
      type: "phenotype_is_a_phenotype"
      direction: OUT
      properties: "Phenotype_is_a_phenotype"
    )
  phenotypeIsAssociatedWithDisease: [Disease!]!
    @relationship(
      type: "phenotype_is_associated_with_disease"
      direction: OUT
      properties: "Phenotype_is_associated_with_disease"
    )
  proteinIsAssociatedWithPhenotypeReverse: [Phenotype!]!
    @relationship(
      type: "protein_is_associated_with_phenotype"
      direction: IN
      properties: "Protein_is_associated_with_phenotype"
    )
}

type Protein {
  id: ID
  esm2_embedding: [Float]
  length: Int
  mass: Int
  organism_id: Int
  organism_name: String
  primary_protein_name: String
  protein_names: [String]
  prott5_embedding: [Float]
  sequence: String
  xref_proteomes: [String]
  compoundTargetsProteinReverse: [Compound!]!
    @relationship(
      type: "compound_targets_protein"
      direction: IN
      properties: "Compound_targets_protein"
    )
  drugTargetsProteinReverse: [Drug!]!
    @relationship(
      type: "drug_targets_protein"
      direction: IN
      properties: "Drug_targets_protein"
    )
  geneEncodesProteinReverse: [Gene!]!
    @relationship(
      type: "Gene_encodes_protein"
      direction: IN
      properties: "Gene_encodes_protein"
    )
  proteinBelongsToOrganism: [OrganismTaxon!]!
    @relationship(
      type: "Protein_belongs_to_organism"
      direction: OUT
      properties: "Protein_belongs_to_organism"
    )
  proteinCatalyzesEcNumber: [EcNumber!]!
    @relationship(
      type: "protein_catalyzes_ec_number"
      direction: OUT
      properties: "Protein_catalyzes_ec_number"
    )
  proteinContributesToMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "protein_contributes_to_molecular_function"
      direction: OUT
      properties: "Protein_contributes_to_molecular_function"
    )
  proteinEnablesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "protein_enables_molecular_function"
      direction: OUT
      properties: "Protein_enables_molecular_function"
    )
  proteinHasDomain: [ProteinDomain!]!
    @relationship(
      type: "protein_has_domain"
      direction: OUT
      properties: "Protein_has_domain"
    )
  proteinInteractsWithProtein: [Protein!]!
    @relationship(
      type: "Protein_interacts_with_protein"
      direction: OUT
      properties: "Protein_interacts_with_protein"
    )
  proteinInvolvedInBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "protein_involved_in_biological_process"
      direction: OUT
      properties: "Protein_involved_in_biological_process"
    )
  proteinIsActiveInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "protein_is_active_in_cellular_component"
      direction: OUT
      properties: "Protein_is_active_in_cellular_component"
    )
  proteinIsAssociatedWithPhenotype: [Phenotype!]!
    @relationship(
      type: "protein_is_associated_with_phenotype"
      direction: OUT
      properties: "Protein_is_associated_with_phenotype"
    )
  proteinLocatedInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "protein_located_in_cellular_component"
      direction: OUT
      properties: "Protein_located_in_cellular_component"
    )
  proteinPartOfInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "protein_part_of_cellular_component"
      direction: OUT
      properties: "Protein_part_of_cellular_component"
    )
  proteinTakePartInPathway: [Pathway!]!
    @relationship(
      type: "protein_take_part_in_pathway"
      direction: OUT
      properties: "Protein_take_part_in_pathway"
    )
}

type ProteinDomain {
  id: ID
  name: String
  dom2vec_embedding: [Float]
  child_list: [String]
  ec: [String]
  parent_list: [String]
  pdb: [String]
  pfam: [String]
  protein_count: Int
  type: String
  proteinDomainEnablesMolecularFunction: [MolecularFunction!]!
    @relationship(
      type: "protein_domain_enables_molecular_function"
      direction: OUT
      properties: "Protein_domain_enables_molecular_function"
    )
  proteinDomainInvolvedInBiologicalProcess: [BiologicalProcess!]!
    @relationship(
      type: "protein_domain_involved_in_biological_process"
      direction: OUT
      properties: "Protein_domain_involved_in_biological_process"
    )
  proteinDomainLocatedInCellularComponent: [CellularComponent!]!
    @relationship(
      type: "protein_domain_located_in_cellular_component"
      direction: OUT
      properties: "Protein_domain_located_in_cellular_component"
    )
  proteinHasDomainReverse: [Protein!]!
    @relationship(
      type: "protein_has_domain"
      direction: IN
      properties: "Protein_has_domain"
    )
}

type Reaction {
  id: ID
  name: String
  rxnfp_embedding: [Float]
}

type SideEffect {
  id: ID
  name: String
  synonyms: [String]
  drugHasSideEffectReverse: [Drug!]!
    @relationship(
      type: "drug_has_side_effect"
      direction: IN
      properties: "Drug_has_side_effect"
    )
  sideEffectIsASideEffect: [SideEffect!]!
    @relationship(
      type: "side_effect_is_a_side_effect"
      direction: OUT
      properties: "Side_effect_is_a_side_effect"
    )
}

###########################
# Relationship interfaces #
###########################

###
# BiologicalProcess -> Any
###

interface Biological_process_is_a_biological_process @relationshipProperties {
  id: ID!
}

interface Biological_process_negatively_regulates_biological_process
  @relationshipProperties {
  id: ID!
}

interface Biological_process_negatively_regulates_molecular_function
  @relationshipProperties {
  id: ID!
}

interface Biological_process_part_of_biological_process
  @relationshipProperties {
  id: ID!
}

interface Biological_process_positively_regulates_biological_process
  @relationshipProperties {
  id: ID!
}

interface Biological_process_positively_regulates_molecular_function
  @relationshipProperties {
  id: ID!
}

###
# CellularComponent -> Any
###

interface Cellular_component_is_a_cellular_component @relationshipProperties {
  id: ID!
}

interface Cellular_component_part_of_cellular_component
  @relationshipProperties {
  id: ID!
}

###
# Disease -> Any
###

interface Disease_is_a_disease @relationshipProperties {
  id: ID!
}

interface Disease_is_associated_with_disease @relationshipProperties {
  id: ID!
  disgenet_jaccard_genes_score: Float
  disgenet_jaccard_variants_score: Float
  source: [String]
}

interface Disease_is_comorbid_with_disease @relationshipProperties {
  id: ID!
}

interface Disease_is_treated_by_drug @relationshipProperties {
  id: ID!
  max_phase: Int
  pubmed_ids: [String]
  source: [String]
}

interface Disease_modulates_pathway @relationshipProperties {
  id: ID!
  source: [String]
}

###
# EcNumber -> Any
###

interface Ec_number_is_a_ec_number @relationshipProperties {
  id: ID!
}

###
# Gene -> Any
###

interface Gene_encodes_protein @relationshipProperties {
  id: ID!
}

interface Gene_is_orthologous_with_gene @relationshipProperties {
  id: ID!
  oma_orthology_score: Float
  relation_type: String
  source: [String]
}

interface Gene_is_related_to_disease @relationshipProperties {
  id: ID!
  allele_id: String
  clinical_significance: String
  dbsnp_id: [String]
  diseases_confidence_score: Float
  disgenet_gene_disease_score: Float
  disgenet_variant_disease_score: Float
  opentargets_score: Float
  pubmed_ids: [String]
  review_status: Int
  source: [String]
  variant_source: [String]
  variation_id: String
}

interface Gene_regulates_gene @relationshipProperties {
  id: ID!
  dorothea_confidence_level: String
  pubmed_id: [String]
  source: [String]
  tf_effect: String
}

###
# MolecularFunction -> Any
###

interface Molecular_function_is_a_molecular_function @relationshipProperties {
  id: ID!
}

interface Molecular_function_negatively_regulates_molecular_function
  @relationshipProperties {
  id: ID!
}

interface Molecular_function_part_of_molecular_function
  @relationshipProperties {
  id: ID!
}

interface Molecular_function_positively_regulates_molecular_function
  @relationshipProperties {
  id: ID!
}

###
# Compound -> Any
###

interface Compound_targets_protein @relationshipProperties {
  id: ID
  activity_type: String
  activity_value: Float
  assay_chembl: [String]
  confidence_score: Float
  pchembl: Float
  references: [String]
  source: [String]
  stitch_combined_score: Float
}

###
# OrganismTaxon -> Any
###

# Wow, such empty

###
# Pathway -> Any
###

interface Pathway_is_equivalent_to_pathway @relationshipProperties {
  id: ID!
}

interface Pathway_is_part_of_pathway @relationshipProperties {
  id: ID!
}

interface Pathway_is_ortholog_to_pathway @relationshipProperties {
  id: ID!
}

interface Pathway_participates_pathway @relationshipProperties {
  id: ID!
}

###
# Phenotype -> Any
###

interface Phenotype_is_a_phenotype @relationshipProperties {
  id: ID!
}

interface Phenotype_is_associated_with_disease @relationshipProperties {
  id: ID!
  evidence: String
  pubmed_ids: [String]
}

###
# Protein -> Any
###

interface Protein_belongs_to_organism @relationshipProperties {
  id: ID!
}

interface Protein_catalyzes_ec_number @relationshipProperties {
  id: ID!
}

interface Protein_contributes_to_molecular_function @relationshipProperties {
  id: ID!
  evidence_code: String
  reference: String
}

interface Protein_enables_molecular_function @relationshipProperties {
  id: ID!
  evidence_code: String
  reference: String
}

interface Protein_has_domain @relationshipProperties {
  id: ID!
  start: String
  end: String
}

interface Protein_interacts_with_protein @relationshipProperties {
  id: ID!
  intact_score: Float
  interaction_type: String
  method: String
  pubmed_id: [String]
  source: [String]
  string_combined_score: Int
  string_physical_combined_score: Int
}

interface Protein_involved_in_biological_process @relationshipProperties {
  id: ID!
  evidence_code: String
  reference: String
}

interface Protein_is_active_in_cellular_component @relationshipProperties {
  id: ID!
  evidence_code: String
  reference: String
}

interface Protein_is_associated_with_phenotype @relationshipProperties {
  id: ID!
}

interface Protein_located_in_cellular_component @relationshipProperties {
  id: ID!
  evidence_code: String
  reference: String
}

interface Protein_part_of_cellular_component @relationshipProperties {
  id: ID!
  evidence_code: String
  reference: String
}

interface Protein_take_part_in_pathway @relationshipProperties {
  id: ID!
  source: String
}

###
# ProteinDomain -> Any
###

interface Protein_domain_enables_molecular_function @relationshipProperties {
  id: ID!
}

interface Protein_domain_involved_in_biological_process
  @relationshipProperties {
  id: ID!
}

interface Protein_domain_located_in_cellular_component @relationshipProperties {
  id: ID!
}

###
# SideEffect -> Any
###

interface Side_effect_is_a_side_effect @relationshipProperties {
  id: ID!
}

###
# Drug -> Any
###

interface Drug_downregulates_gene @relationshipProperties {
  id: ID!
  references: [String]
}

interface Drug_has_side_effect @relationshipProperties {
  id: ID!
  frequency: String
  proportional_reporting_ratio: Float
  source: [String]
}

interface Drug_has_target_in_pathway @relationshipProperties {
  id: ID!
  source: String
}

interface Drug_upregulates_gene @relationshipProperties {
  id: ID!
  references: [String]
}

interface Drug_interacts_with_drug @relationshipProperties {
  id: ID!
  interaction_level: String
  interaction_type: [String]
  recommendation: String
  source: [String]
}

interface Drug_targets_protein @relationshipProperties {
  id: ID!
  activity_type: String
  activity_value: Float
  confidence_score: Float
  dgidb_score: Float
  direct_interaction: Boolean
  disease_efficacy: Boolean
  known_action: String
  mechanism_of_action: String
  mechanism_of_action_type: String
  pchembl: Float
  references: [String]
  source: [String]
  stitch_combined_score: Float
}
`

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.MY_NEO4J_PASSWORD)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({ req, sessionConfig: { database: process.env.NEO4J_DATABASE_NAME }}),
    listen: { port: process.env.API_PORT },
});

console.log(`🚀 Server ready at ${url}`);

