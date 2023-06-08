import {Button} from '@hilla/react-components/Button.js';
import {Notification} from '@hilla/react-components/Notification.js';
import {useState} from 'react';
import {GeneratorEndpoint} from "Frontend/generated/endpoints.js";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";

export default function GeneratorView() {
    const [idea, setIdea] = useState('');

    return (
        <>
            <VerticalLayout className="flex p-m gap-m">
                <Button
                    onClick={async () => {
                        const serverResponse = await GeneratorEndpoint.generate();
                        setIdea(serverResponse);
                    }}
                >
                    Generate Hackathon idea
                </Button>
                {idea && (
                    <div className=" w-full">
                        <h3 className="mb-m">New Idea:</h3>
                        <p className="p-m m-auto border border-success-10">{idea}</p>
                    </div>
                )}
            </VerticalLayout>
        </>
    );
}
