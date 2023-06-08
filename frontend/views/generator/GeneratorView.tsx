import {Button} from '@hilla/react-components/Button.js';
import {useEffect, useState} from 'react';
import {GeneratorEndpoint, KeywordEndpoint} from "Frontend/generated/endpoints.js";
import {VerticalLayout} from "@hilla/react-components/VerticalLayout";
import {HorizontalLayout} from "@hilla/react-components/HorizontalLayout";
import {ComboBox} from "@hilla/react-components/ComboBox";
import {EndpointValidationError} from "@hilla/frontend";
import {FormikErrors, useFormik} from "formik";
import * as _ from "lodash";
import {object, string} from 'yup';
import {Item} from "@hilla/react-components/Item.js";
import {MessageList} from "@hilla/react-components/MessageList";

const keywordSchema = object({
    product: string().required(),
    subject: string().required(),
    how: string().required(),
    result: string().required(),
});


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
    const [ideaList, setIdeaList] = useState(Array<String>);

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
            validationSchema: keywordSchema,
            onSubmit: async (value: Keyword, {setSubmitting, setErrors}) => {
                try {
                    const serverResponse =
                        await GeneratorEndpoint.getIdeas([value.product, value.subject, value.how, value.result]);
                    setIdeaList(serverResponse);
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

        formik.values.product = randomKeyword.product;
        formik.values.subject = randomKeyword.subject;
        formik.values.how = randomKeyword.how;
        formik.values.result = randomKeyword.result;
        // formik.setFieldValue('subject', randomKeyword.subject);
        // formik.setFieldValue('how', randomKeyword.how);
        // formik.setFieldValue('result', randomKeyword.result);
        formik.validateForm(randomKeyword)  //For the validation errors to clear
    }

    const clearValues = () => {

        formik.values.product = empty.product;
        formik.values.subject = empty.subject;
        formik.values.how = empty.how;
        formik.values.result = empty.result;
        // formik.setFieldValue('product', empty.product);
        // formik.setFieldValue('subject', empty.subject);
        // formik.setFieldValue('how', empty.how);
        // formik.setFieldValue('result', empty.result);

        formik.validateForm(empty)  //For the validation errors to clear
    }


    return (
        <>
            <VerticalLayout className="p-m gap-m">
                <form>
                    <HorizontalLayout style={{alignItems: "baseline"}}>
                        <ComboBox
                            className="m-m"
                            label="Product"
                            name="product"
                            items={products}
                            value={formik.values.product}
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.product}
                            invalid={!!formik.errors.product}
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
                            invalid={!!formik.errors.subject}
                            required
                        />
                        <ComboBox
                            className="m-m"
                            label="How"
                            name="how"
                            items={hows}
                            value={formik.values.how}
                            onChange={formik.handleChange}
                            errorMessage={formik.errors.how}
                            invalid={!!formik.errors.how}
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
                            invalid={!!formik.errors.result}
                            required={true}
                        />

                        <Button
                            theme="secondary"
                            onClick={clearValues}
                        >Clear
                        </Button>
                    </HorizontalLayout>
                    <HorizontalLayout className="m-auto">
                        <Button
                            theme="primary"
                            className="m-m"
                            disabled={formik.isSubmitting}
                            onClick={formik.submitForm}
                        >
                            Generate Hackathon Idea
                        </Button>
                        <Button
                            theme="secondary"
                            className="p-l"
                            onClick={randomizeValues}
                        >
                            Randomize <br/>
                            Keywords
                        </Button>
                    </HorizontalLayout>
                </form>
                {ideaList && !!ideaList.length && (
                    <div className=" w-full">
                        <h3 className="mb-m">Here are some ideas:</h3>
                        <MessageList className="p-m m-auto border border-success-10">
                            {ideaList.map((idea, index) =>
                                (
                                    <Item  key={index}>
                                        {idea}
                                    </Item>
                                ))
                            }
                        </MessageList>
                    </div>
                )}
            </VerticalLayout>
        </>
    );
}
