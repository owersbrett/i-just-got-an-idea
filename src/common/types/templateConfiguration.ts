
export class TemplateConfiguration {
    templateConfigurationId!: string;
    keywords!: string[];
    name!: string;
    description!: string;
    uid!: string | null;
    templates!: Template[];
}

export class Template {
    name!: string;
    description!: string;
    templateId!: string;
    inputStatement!: string;
    processStatement!: string;
    formatStatement!: string;
    
}

export class GeneratedContentConfiguration {
    generatedContentConfigurationId!: string;
    uid!: string;
    templateConfigurationId!: string;
    type!: "blogpost";
    createdAt!: Date;
    updatedAt!: Date;
    templateId!: string | null;
}

export class GeneratedContent {
    generatedContentId!: string;
    uid!: string;
    templateConfigurationId!: string;
    content!: string;
    type!: "blogpost";
    createdAt!: Date;
    updatedAt!: Date;
    templateId!: string | null;
    prompt!: string;
    examples!: string[];

}
