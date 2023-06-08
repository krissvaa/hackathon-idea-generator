import {Button} from '@hilla/react-components/Button.js';
import {useEffect, useState} from 'react';
import {GeneratorEndpoint, KeywordEndpoint} from "Frontend/generated/endpoints.js";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {ComboBox} from "@hilla/react-components/ComboBox";

export default function GeneratorView() {
    const [product, setProduct] = useState('');
    const [subject, setSubject] = useState('');
    const [how, setHow] = useState('');
    const [result, setResult] = useState('');

    const [ideaList, setIdeaList] = useState('');

    const [products, setProducts] = useState(Array<string>());
    const [subjects, setSubjects] = useState(Array<string>());
    const [hows, setHows] = useState(Array<string>());
    const [results, setResults] = useState(Array<string>());

    useEffect(() => {
        (async () => {
            const fetchedProducts = await KeywordEndpoint.getProductsKeywords();
            setProducts(fetchedProducts);

            const fetchedSubjects = await KeywordEndpoint.getSubjectsKeywords();
            setSubjects(fetchedSubjects);

            const fetchedHows = await KeywordEndpoint.getHowsKeywords();
            setHows(fetchedHows);

            const fetchedResults = await KeywordEndpoint.getResultKeywords();
            setResults(fetchedResults);
        })();
    }, []);


    return (
        <>
            <VerticalLayout className="p-m gap-m">
                <HorizontalLayout className="">
                    <ComboBox
                        className="m-m"
                        label="Product"
                        items={products}
                        value={product}
                        required={true}
                    />
                    <ComboBox
                        className="m-m"
                        label="Subject"
                        items={subjects}
                        value={subject}
                        required={true}
                    />
                    <ComboBox
                        className="m-m"
                        label="How"
                        items={hows}
                        value={how}
                        required={true}
                    />
                    <ComboBox
                        className="m-m"
                        label="Twist/Result"
                        items={results}
                        value={result}
                        required={true}
                    />
                </HorizontalLayout>
                <Button
                    typeof="submit"
                    onClick={async () => {
                        const serverResponse =
                            await GeneratorEndpoint.getIdeas([product, subject, how, result]);
                        setIdeaList(serverResponse);
                    }}
                >
                    Generate Hackathon idea
                </Button>
                {ideaList && (
                    <div className=" w-full">
                        <h3 className="mb-m">New Idea:</h3>
                        <p className="p-m m-auto border border-success-10">{ideaList}</p>
                    </div>
                )}
            </VerticalLayout>
        </>
    );
}
