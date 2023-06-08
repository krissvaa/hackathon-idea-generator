import {Button} from '@hilla/react-components/Button.js';
import {useEffect, useState} from 'react';
import {GeneratorEndpoint, KeywordEndpoint} from "Frontend/generated/endpoints.js";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {EndpointValidationError} from "@hilla/frontend";
import {FormikErrors, useFormik} from "formik";
import * as _ from "lodash";


type Keyword = {
    product: string,
    subject: string,
    how: string,
    result: string,
}
export default function GeneratorView() {
    const [products, setProducts] = useState(Array<string>());
    const [subjects, setSubjects] = useState(Array<string>());
    const [hows, setHows] = useState(Array<string>());
    const [results, setResults] = useState(Array<string>());

    const empty: Keyword = {product: '', subject: '', how: '', result: ''};
    const [ideaList, setIdeaList] = useState('');

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

    const formik = useFormik({
            initialValues: empty,
            onSubmit: async (value: Keyword, {setSubmitting, setErrors}) => {
                try {
                    if (value.product && value.result && value.how && value.subject) {
                        const serverResponse =
                            await GeneratorEndpoint.getIdeas([value.product, value.subject, value.how, value.result]);
                        setIdeaList(serverResponse);
                        // formik.resetForm();
                    }
                } catch (e: unknown) {
                    if (e instanceof EndpointValidationError) {
                        const errors: FormikErrors<Keyword> = {};
                        for (const error of e.validationErrorData) {
                            if (typeof error.parameterName === 'string' && !(error.parameterName in empty)) {
                                const key = error.parameterName as string & keyof Keyword;
                                errors[key] = error.message.substring(error.message.indexOf("validation error:"));
                            }
                        }
                        setErrors(errors);
                    }
                } finally {
                    setSubmitting(false);
                }
            },
        }
    )

    const randomizeValues = () => {
        const randomKeyword: Keyword = {
            product: _.sample(products) || '',
            subject: _.sample(subjects) || '',
            how: _.sample(hows) || '',
            result: _.sample(results) || ''
        }

        formik.setFieldValue('product', randomKeyword.product);
        formik.setFieldValue('subject', randomKeyword.subject);
        formik.setFieldValue('how', randomKeyword.how);
        formik.setFieldValue('result', randomKeyword.result);
    }


    return (
        <>
            <VerticalLayout className="p-m gap-m">
                <HorizontalLayout className="">
                    <ComboBox
                        className="m-m"
                        label="Product"
                        name="product"
                        items={products}
                        value={formik.values.product}
                        onChange={formik.handleChange}
                        errorMessage={formik.errors.product}
                        required={true}
                    />
                    <ComboBox
                        className="m-m"
                        label="Subject"
                        name="subject"
                        items={subjects}
                        value={formik.values.subject}
                        onChange={formik.handleChange}
                        errorMessage={formik.errors.subject}
                        required={true}
                    />
                    <ComboBox
                        className="m-m"
                        label="How"
                        name="how"
                        items={hows}
                        value={formik.values.how}
                        onChange={formik.handleChange}
                        errorMessage={formik.errors.how}
                        required={true}
                    />
                    <ComboBox
                        className="m-m"
                        label="Twist/Result"
                        name="result"
                        items={results}
                        value={formik.values.result}
                        onChange={formik.handleChange}
                        errorMessage={formik.errors.result}
                        required={true}
                    />
                </HorizontalLayout>
                <HorizontalLayout className="m-auto">
                    <Button
                        theme="primary"
                        typeof="submit"
                        className="m-m"
                        disabled={formik.isSubmitting}
                        onClick={formik.submitForm}
                    >
                        Generate Hackathon idea
                    </Button>
                    <Button
                        theme="secondary"
                        className="p-l"
                        onClick={randomizeValues}
                    >
                        Randomize <br/>
                        keywords
                    </Button>
                </HorizontalLayout>
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
