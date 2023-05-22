import { useEffect, useState } from "react";

import { API } from "@/pages/api/api";
import { Idea } from "@/common/types/idea";

interface IdeaViewProps {
    idea: Idea | null;
}

export const IdeaView: React.FC<IdeaViewProps> = (props: IdeaViewProps): React.JSX.Element => {
    const [selectedIdea, selectIdea] = useState<Idea | null>(props.idea);

    // useEffect(() => {
    //     setInterval(() => {
    //         API.get(`/api/idea?ideaId=${selectedIdea?.ideaId}`, "Error getting idea: " + selectedIdea?.ideaId ?? "404").then((response) => { 
    //             selectIdea(response.data as Idea);
    //         }
    //         ).catch((error) => {
    //             console.log(error);
    //         }
    //         )
    //     })
    // }, [selectedIdea])

    return (<form className="text-black p-4">
        <p key={"index"}>Index: {selectedIdea?.index}</p>
        <p key={"idea"}>Idea: {selectedIdea?.idea}</p>
        <p key={"keywords"}>Keywords:</p>
        {selectedIdea?.keywords.map((keyword, index) => <p key={keyword + index}>&nbsp;&nbsp;{keyword}</p>)}
        <p key={`ideaId:${selectedIdea?.ideaId}`}>IdeaId: {selectedIdea?.ideaId}</p>

    </form>)
}
