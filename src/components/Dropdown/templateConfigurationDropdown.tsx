import { Idea } from '@/common/types/idea';
import { TemplateConfiguration } from '@/common/types/templateConfiguration';
import { ChangeEvent, useState } from 'react';

interface TemplateConfigurationDropdownProps {
    templateConfigurations: TemplateConfiguration[];
    selectedIdea: Idea | null;
    onSelectTemplateConfiguration: (templateConfigurationId: string) => void;
    onExecute: (templateConfigurationId: string) => void;
}
const TemplateConfigurationDropdown: React.FC<TemplateConfigurationDropdownProps> = ({
    templateConfigurations,
    onSelectTemplateConfiguration,
    selectedIdea,
    onExecute
}) => {
    const [selectedConfiguration, setSelectedConfiguration] = useState<TemplateConfiguration | null>(null);

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedTemplateConfigurationId = event.target.value;
        let config = templateConfigurations.find((templateConfiguration) => templateConfiguration.templateConfigurationId === selectedTemplateConfigurationId);
        console.log("config");
        console.log(config);
        if (config){
            setSelectedConfiguration(config);
            onSelectTemplateConfiguration(selectedTemplateConfigurationId);
        }

    };

    return (
        <div className='flex flex-row'>
            <select onChange={handleSelectChange}>
                <option value="">Select a Template Configuration</option>
                {templateConfigurations.map((templateConfiguration) => (
                    <option key={templateConfiguration.templateConfigurationId} value={templateConfiguration.templateConfigurationId}>
                        {templateConfiguration.name}
                    </option>
                ))}
            </select>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => { if (selectedConfiguration){
                onExecute(selectedConfiguration.templateConfigurationId);
            } }}>Execute</button>
            <p>Template Configuration: {selectedConfiguration?.name ?? ""}</p>
            <p>Idea: {selectedIdea?.idea ?? ""}</p>
        </div>
    );
};

export default TemplateConfigurationDropdown;
